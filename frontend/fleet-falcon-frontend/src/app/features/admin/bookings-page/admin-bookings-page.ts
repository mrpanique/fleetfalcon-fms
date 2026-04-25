import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminBookingListComponent } from '../components/booking-list/booking-list';
import { AdminBookingListItem } from '../components/booking-list-item/booking-list-item.model';
import { ApiBooking, BookingFilters, EmployeeBookingsService } from '../../employee/services/employee-bookings.service';

type BookingStatus = 'pending' | 'approved' | 'active' | 'completed' | 'rejected' | 'cancelled';

interface AdminBookingItem {
  id: string;
  employeeName: string;
  employeeId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
}

@Component({
  selector: 'app-admin-bookings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminBookingListComponent],
  templateUrl: './admin-bookings-page.html',
  styleUrl: './admin-bookings-page.css'
})
export class AdminBookingsPageComponent implements OnInit {
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly statusFilter = signal<'all' | BookingStatus>('all');
  protected readonly employeeNameFilter = signal('');
  protected readonly employeeIdFilter = signal('');
  protected readonly draftStatusFilter = signal<'all' | BookingStatus>('all');
  protected readonly draftEmployeeNameFilter = signal('');
  protected readonly draftEmployeeIdFilter = signal('');

  protected readonly bookings = signal<AdminBookingItem[]>([]);

  protected readonly filteredBookings = computed(() => {
    const status = this.statusFilter();
    const employeeName = this.employeeNameFilter().trim().toLowerCase();
    const employeeId = this.employeeIdFilter().trim().toLowerCase();

    return this.bookings().filter((booking) => {
      const statusMatches = status === 'all' || booking.status === status;
      const nameMatches = !employeeName || booking.employeeName.toLowerCase().includes(employeeName);
      const idMatches = !employeeId || booking.employeeId.toLowerCase().includes(employeeId);

      return statusMatches && nameMatches && idMatches;
    });
  });

  protected readonly filteredBookingListItems = computed<AdminBookingListItem[]>(() =>
    this.filteredBookings().map((booking) => ({
      id: booking.id,
      detailsRoute: `/admin/bookings/${booking.id}`,
      ariaLabel: `Booking of ${booking.employeeName} for ${booking.vehicleName}`,
      employeeName: booking.employeeName,
      employeeId: booking.employeeId,
      vehicleName: booking.vehicleName,
      dateRange: `${booking.startDate} - ${booking.endDate}`,
      status: booking.status
    }))
  );

  protected setDraftStatusFilter(value: 'all' | BookingStatus): void {
    this.draftStatusFilter.set(value);
  }

  protected setDraftEmployeeNameFilter(value: string): void {
    this.draftEmployeeNameFilter.set(value);
  }

  protected setDraftEmployeeIdFilter(value: string): void {
    this.draftEmployeeIdFilter.set(value);
  }

  protected applyFilters(): void {
    this.statusFilter.set(this.draftStatusFilter());
    this.employeeNameFilter.set(this.draftEmployeeNameFilter().trim());
    this.employeeIdFilter.set(this.draftEmployeeIdFilter().trim());

    this.loadBookings({
      status: this.statusFilter(),
      employeeName: this.employeeNameFilter() || null,
      employeeId: this.employeeIdFilter() || null
    });
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(filters?: BookingFilters): void {
    this.employeeBookingsService.getBookings(filters).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings.map((booking) => this.toAdminBookingItem(booking)));
      },
      error: (error) => {
        console.error('Failed to load admin bookings', error);
        this.bookings.set([]);
      }
    });
  }

  private toAdminBookingItem(booking: ApiBooking): AdminBookingItem {
    return {
      id: String(booking.id),
      employeeName: this.getEmployeeName(booking),
      employeeId: booking.employee?.employeeId ?? '-',
      vehicleName: this.getVehicleName(booking),
      startDate: this.formatDateTime(booking.startDate),
      endDate: this.formatDateTime(booking.endDate),
      status: this.toBookingStatus(booking.status)
    };
  }

  private getEmployeeName(booking: ApiBooking): string {
    const firstName = booking.employee?.firstName?.trim() ?? '';
    const lastName = booking.employee?.lastName?.trim() ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unknown employee';
  }

  private getVehicleName(booking: ApiBooking): string {
    if (!booking.vehicle) {
      return 'Unknown vehicle';
    }

    return `${booking.vehicle.brand} ${booking.vehicle.model}`;
  }

  private toBookingStatus(status: string): BookingStatus {
    const normalized = status.toLowerCase();
    if (
      normalized === 'pending' ||
      normalized === 'approved' ||
      normalized === 'active' ||
      normalized === 'completed' ||
      normalized === 'rejected' ||
      normalized === 'cancelled'
    ) {
      return normalized;
    }

    return 'pending';
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

}
