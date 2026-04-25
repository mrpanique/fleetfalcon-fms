import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminBookingListComponent } from '../components/booking-list/booking-list';
import { AdminBookingListItem, AdminBookingStatus } from '../components/booking-list-item/booking-list-item.model';
import { ApiBooking, EmployeeBookingsService } from '../../employee/services/employee-bookings.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [AdminBookingListComponent],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly pendingBookings = signal<AdminBookingListItem[]>([]);

  protected adminBookings: AdminBookingListItem[] = [
    {
      id: '101',
      detailsRoute: '/admin/my-bookings/101',
      ariaLabel: 'Booking for Audi A4',
      employeeName: 'Admin User',
      employeeId: 'ADM-001',
      vehicleName: 'Audi A4',
      dateRange: '2026-04-10 - 2026-04-12',
      status: 'approved'
    },
    {
      id: '102',
      detailsRoute: '/admin/my-bookings/102',
      ariaLabel: 'Booking for Volkswagen Passat',
      employeeName: 'Admin User',
      employeeId: 'ADM-001',
      vehicleName: 'Volkswagen Passat',
      dateRange: '2026-04-15 - 2026-04-18',
      status: 'approved'
    }
  ];

  ngOnInit(): void {
    this.employeeBookingsService.getBookings().subscribe({
      next: (bookings) => {
        this.pendingBookings.set(bookings.map((booking) => this.toAdminBookingListItem(booking)));
      },
      error: (error) => {
        console.error('Failed to load bookings for admin dashboard', error);
        this.pendingBookings.set([]);
      }
    });
  }

  private toAdminBookingListItem(booking: ApiBooking): AdminBookingListItem {
    const employeeName = this.getEmployeeName(booking);
    const vehicleName = this.getVehicleName(booking);
    const status = this.toAdminStatus(booking.status);

    return {
      id: String(booking.id),
      detailsRoute: `/admin/bookings/${booking.id}`,
      ariaLabel: `Booking of ${employeeName} for ${vehicleName}`,
      employeeName,
      employeeId: booking.employee?.employeeId ?? '-',
      vehicleName,
      dateRange: `${this.formatDateTime(booking.startDate)} - ${this.formatDateTime(booking.endDate)}`,
      status,
      highlightPending: status === 'pending'
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

  private toAdminStatus(status: string): AdminBookingStatus {
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
