import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { BookingListItem } from '../components/booking-list-item/booking-list-item.model';

@Component({
  selector: 'app-employee-dashboard-page',
  imports: [RouterLink, BookingListComponent],
  templateUrl: './employee-dashboard-page.html',
  styleUrl: './employee-dashboard-page.css'
})
export class EmployeeDashboardPageComponent {
  protected readonly upcomingBookings: BookingListItem[] = [
    {
      id: '1001',
      detailsRoute: '/my-bookings/1001',
      timeRange: '2026.03.31 09:00 - 2026.04.01 18:00',
      vehicleName: 'Toyota Corolla',
      status: 'APPROVED'
    },
    {
      id: '1002',
      detailsRoute: '/my-bookings/1002',
      timeRange: '2026.04.03 07:30 - 2026.04.03 15:30',
      vehicleName: 'Skoda Octavia',
      status: 'PENDING'
    }
  ];
}
