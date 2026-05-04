import { AsyncPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { AdminBookingListComponent } from '../components/booking-list/booking-list';
import { AdminBookingListItem, AdminBookingStatus } from '../components/booking-list-item/booking-list-item.model';
import { ApiBooking, EmployeeBookingsService } from '../../employee/services/employee-bookings.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [AdminBookingListComponent, AsyncPipe],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly pendingBookings = signal<AdminBookingListItem[]>([]);
  protected readonly currentEmployeeId = computed(() => this.authService.currentUser()?.employeeId ?? '');
  protected readonly myUpcomingBookings$ = toObservable(this.currentEmployeeId).pipe(
    switchMap((employeeId) => {
      if (!employeeId) {
        return of([]);
      }

      return this.employeeBookingsService.getBookings({ employeeId }).pipe(
        // Convert bookings into the admin list item view model.
        switchMap((bookings) => of(bookings.map((booking) => this.toAdminBookingListItem(booking))))
      );
    })
  );

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
