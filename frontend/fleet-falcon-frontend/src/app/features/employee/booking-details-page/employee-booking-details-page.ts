import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MileageModalComponent } from '../../../core/components/mileage-modal/mileage-modal';
import { BookingInfoCardComponent } from './components/booking-info-card/booking-info-card';
import { AdminEmployeeListItemComponent } from '../../admin/components/employee-list-item/employee-list-item';
import { AdminEmployeeListItem } from '../../admin/components/employee-list-item/employee-list-item.model';

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

  protected readonly bookingId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

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

  protected readonly bookingOwner = signal<AdminEmployeeListItem>({
    id: 'u1',
    name: 'John Smith',
    role: 'EMPLOYEE',
    employeeId: 'EMP-001',
    department: 'Logistics',
    phoneNumber: '+36 30 123 4567',
    drivingLicenseNumber: 'DL-458721'
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
    // UI-only placeholder until backend integration is added.
    if (this.mileageModalMode() === 'checkin') {
      console.log('Check-in booking', this.bookingId(), 'endMileage:', this.mileageInput());
    } else {
      console.log('Check-out booking', this.bookingId(), 'startMileage:', this.mileageInput());
    }
    this.mileageModalMode.set(null);
  }
}
