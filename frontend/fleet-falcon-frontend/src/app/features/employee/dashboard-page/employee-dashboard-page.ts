import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { EmployeeBookingsService } from '../services/employee-bookings.service';

@Component({
  selector: 'app-employee-dashboard-page',
  imports: [RouterLink, BookingListComponent, AsyncPipe],
  templateUrl: './employee-dashboard-page.html',
  styleUrl: './employee-dashboard-page.css'
})
export class EmployeeDashboardPageComponent {
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly upcomingBookings$ = this.employeeBookingsService.getBookingsByEmployeeId('EMP-001');
}
