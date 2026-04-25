import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeBookingsService } from '../services/employee-bookings.service';
import { EmployeeVehiclesService } from '../services/employee-vehicles.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-employee-create-booking-page',
  imports: [RouterLink],
  templateUrl: './employee-create-booking-page.html',
  styleUrl: './employee-create-booking-page.css'
})
export class EmployeeCreateBookingPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeVehiclesService = inject(EmployeeVehiclesService);
  private readonly employeeBookingsService = inject(EmployeeBookingsService);
  private readonly toastService = inject(ToastService);

  private readonly currentEmployeeCode = 'EMP-001';

  protected readonly vehicleId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('vehicleId') ?? '')),
    { initialValue: '' }
  );
  protected readonly vehicle = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('vehicleId')),
      switchMap((id) => {
        if (!id) {
          return of(null);
        }

        return this.employeeVehiclesService.getVehicleById(id);
      })
    ),
    { initialValue: null }
  );

  protected readonly isAdmin = computed(() => this.router.url.startsWith('/admin/'));
  protected readonly startDate = signal('');
  protected readonly endDate = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal('');

  protected readonly dayCount = computed(() => {
    const start = this.startDate();
    const end = this.endDate();

    if (!start || !end) {
      return 0;
    }

    const startAt = new Date(start);
    const endAt = new Date(end);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
      return 0;
    }

    const diffMs = endAt.getTime() - startAt.getTime();
    const dayMs = 1000 * 60 * 60 * 24;

    return Math.max(1, Math.ceil(diffMs / dayMs));
  });

  protected readonly dailyPrice = computed(() => this.vehicle()?.dailyPrice ?? 0);
  protected readonly estimatedCost = computed(() => this.dayCount() * this.dailyPrice());

  protected onStartDateInput(value: string): void {
    this.startDate.set(value);
  }

  protected onEndDateInput(value: string): void {
    this.endDate.set(value);
  }

  protected createBooking(): void {
    this.submitError.set('');

    const vehicleId = this.toNullableNumber(this.vehicleId());
    if (vehicleId == null) {
      this.submitError.set('No vehicle selected. Open this page from a vehicle details page.');
      return;
    }

    if (this.dayCount() <= 0) {
      this.submitError.set('Select a valid booking period. End date must be after start date.');
      return;
    }

    const startDate = this.toApiDateTime(this.startDate());
    const endDate = this.toApiDateTime(this.endDate());

    this.isSubmitting.set(true);

    this.employeeBookingsService.resolveEmployeeDbIdByEmployeeCode(this.currentEmployeeCode).pipe(
      switchMap((employeeId) => {
        if (employeeId == null) {
          return throwError(() => new Error(`Employee ${this.currentEmployeeCode} was not found.`));
        }

        return this.employeeBookingsService.createBooking({
          vehicleId,
          employeeId,
          startDate,
          endDate
        });
      })
    ).subscribe({
      next: (booking) => {
        this.isSubmitting.set(false);
        this.toastService.success('Booking created successfully.');
        if (this.isAdmin()) {
          this.router.navigate(['/admin/my-bookings', booking.id]);
          return;
        }

        this.router.navigate(['/my-bookings', booking.id]);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        console.error('Failed to create booking', error);
        this.submitError.set('Failed to create booking. Please check your selected dates and try again.');
      }
    });
  }

  protected vehicleDetailsRoute(): string[] {
    if (this.isAdmin()) {
      return ['/admin/vehicles', this.vehicleId()];
    }

    return ['/vehicles', this.vehicleId()];
  }

  private toApiDateTime(value: string): string {
    if (!value) {
      return value;
    }

    return value.length === 16 ? `${value}:00` : value;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value == null || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
