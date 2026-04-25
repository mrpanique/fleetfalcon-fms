import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MileageModalComponent } from '../../../core/components/mileage-modal/mileage-modal';
import { BookingInfoCardComponent } from './components/booking-info-card/booking-info-card';
import { AdminEmployeeListItemComponent } from '../../admin/components/employee-list-item/employee-list-item';
import { AdminEmployeeListItem } from '../../admin/components/employee-list-item/employee-list-item.model';
import { ApiBooking, EmployeeBookingsService } from '../services/employee-bookings.service';
import { ToastService } from '../../../core/services/toast.service';

type MileageModalMode = 'checkout' | 'checkin' | null;

@Component({
  selector: 'app-employee-booking-details-page',
  imports: [CommonModule, RouterLink, MileageModalComponent, BookingInfoCardComponent, AdminEmployeeListItemComponent],
  templateUrl: './employee-booking-details-page.html',
  styleUrl: './employee-booking-details-page.css'
})
export class EmployeeBookingDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeBookingsService = inject(EmployeeBookingsService);
  private readonly toastService = inject(ToastService);

  private readonly refreshToken = signal(0);

  protected readonly bookingId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected readonly booking = toSignal(
    combineLatest([
      toObservable(this.bookingId),
      toObservable(this.refreshToken)
    ]).pipe(
      switchMap(([bookingId]) => {
        const id = Number(bookingId);
        if (!Number.isFinite(id)) {
          return of(null);
        }

        return this.employeeBookingsService.getBookingById(id);
      })
    ),
    { initialValue: null }
  );

  protected readonly isBusy = signal(false);

  protected readonly isAdmin = computed(() => this.router.url.startsWith('/admin/'));
  protected readonly mileageModalMode = signal<MileageModalMode>(null);
  protected readonly mileageInput = signal('');
  protected readonly isMileageModalOpen = computed(() => this.mileageModalMode() !== null);
  protected readonly mileageModalTitle = computed(() =>
    this.mileageModalMode() === 'checkin' ? 'Check-in' : 'Check-out'
  );
  protected readonly mileageFieldLabel = computed(() =>
    this.mileageModalMode() === 'checkin' ? 'End mileage' : 'Start mileage'
  );
  protected readonly mileageConfirmLabel = computed(() =>
    this.mileageModalMode() === 'checkin' ? 'Confirm check-in' : 'Confirm check-out'
  );

  protected readonly bookingStatus = computed(() => this.booking()?.status ?? 'UNKNOWN');
  protected readonly bookingCost = computed(() => {
    const booking = this.booking();
    if (!booking) {
      return '-';
    }

    const dailyPrice = booking.vehicle?.dailyPrice ?? null;
    if (booking.status === 'COMPLETED' && booking.cost != null) {
      return `${booking.cost.toLocaleString('hu-HU')} Ft`;
    }

    if (dailyPrice == null) {
      return '-';
    }

    return `${this.estimateCost(booking, dailyPrice).toLocaleString('hu-HU')} Ft (estimated)`;
  });

  protected readonly bookingTimePeriod = computed(() => {
    const booking = this.booking();
    if (!booking) {
      return '-';
    }

    return `${this.formatDateTime(booking.startDate)} - ${this.formatDateTime(booking.endDate)}`;
  });

  protected readonly bookingOwner = computed<AdminEmployeeListItem>(() => {
    const booking = this.booking();
    const employee = booking?.employee;

    return {
      id: String(employee?.id ?? ''),
      name: `${employee?.firstName ?? ''} ${employee?.lastName ?? ''}`.trim() || 'Unknown employee',
      role: employee?.user?.role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      employeeId: employee?.employeeId ?? '-',
      department: employee?.department ?? '-',
      phoneNumber: employee?.phoneNumber ?? '-',
      drivingLicenseNumber: employee?.drivingLicenseNumber ?? '-'
    };
  });

  protected readonly vehicleName = computed(() => {
    const vehicle = this.booking()?.vehicle;
    if (!vehicle) {
      return 'Unknown vehicle';
    }

    return `${vehicle.brand} ${vehicle.model}`;
  });

  protected readonly vehicleDetailsRoute = computed(() => {
    const vehicleId = this.booking()?.vehicle?.id;
    if (!vehicleId) {
      return ['/vehicles'];
    }

    if (this.isAdmin()) {
      return ['/admin/vehicles', vehicleId];
    }

    return ['/vehicles', vehicleId];
  });

  protected openMileageModal(mode: Exclude<MileageModalMode, null>): void {
    this.mileageInput.set('');
    this.mileageModalMode.set(mode);
  }

  protected closeMileageModal(): void {
    this.mileageModalMode.set(null);
  }

  protected onMileageInputValue(value: string): void {
    this.mileageInput.set(value);
  }

  protected confirmMileageAction(): void {
    const id = Number(this.bookingId());
    const mileage = Number(this.mileageInput());
    if (!Number.isFinite(id) || !Number.isFinite(mileage)) {
      return;
    }

    const mode = this.mileageModalMode();
    if (!mode) {
      return;
    }

    const action$ = mode === 'checkin'
      ? this.employeeBookingsService.endBooking(id, mileage)
      : this.employeeBookingsService.startBooking(id, mileage);

    this.isBusy.set(true);
    action$.subscribe({
      next: () => {
        this.isBusy.set(false);
        this.mileageModalMode.set(null);
        this.refresh();
        this.toastService.success(mode === 'checkin' ? 'Check-in completed.' : 'Check-out completed.');
      },
      error: (error) => {
        this.isBusy.set(false);
        console.error('Failed to submit mileage action', error);
        this.toastService.error('Mileage operation failed.');
      }
    });
  }

  protected approveBooking(): void {
    this.runBookingAction((id) => this.employeeBookingsService.approveBooking(id), 'Booking approved.');
  }

  protected rejectBooking(): void {
    this.runBookingAction((id) => this.employeeBookingsService.rejectBooking(id), 'Booking rejected.');
  }

  protected cancelBooking(): void {
    this.runBookingAction((id) => this.employeeBookingsService.cancelBooking(id), 'Booking cancelled.');
  }

  private runBookingAction(action: (bookingId: number) => Observable<ApiBooking>, successMessage: string): void {
    const id = Number(this.bookingId());
    if (!Number.isFinite(id)) {
      return;
    }

    this.isBusy.set(true);
    action(id).subscribe({
      next: () => {
        this.isBusy.set(false);
        this.refresh();
        this.toastService.success(successMessage);
      },
      error: (error) => {
        this.isBusy.set(false);
        console.error(`Booking action failed for booking ${id}`, error);
        this.toastService.error('Operation failed.');
      }
    });
  }

  private refresh(): void {
    this.refreshToken.update((value) => value + 1);
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

  private estimateCost(booking: ApiBooking, dailyPrice: number): number {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return dailyPrice;
    }

    const dayMs = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / dayMs));
    return days * dailyPrice;
  }
}
