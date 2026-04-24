import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { EmployeeBookingsService } from '../services/employee-bookings.service';

@Component({
  selector: 'app-employee-my-bookings-page',
  imports: [BookingListComponent, AsyncPipe],
  templateUrl: './employee-my-bookings-page.html',
  styleUrl: './employee-my-bookings-page.css'
})
export class EmployeeMyBookingsPageComponent {
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly bookings$ = this.employeeBookingsService.getBookingsByEmployeeId('EMP-001');
}
