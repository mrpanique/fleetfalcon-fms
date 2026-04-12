import { Component } from '@angular/core';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { BookingListItem } from '../components/booking-list-item/booking-list-item.model';

@Component({
  selector: 'app-employee-my-bookings-page',
  imports: [BookingListComponent],
  templateUrl: './employee-my-bookings-page.html',
  styleUrl: './employee-my-bookings-page.css'
})
export class EmployeeMyBookingsPageComponent {
  protected readonly bookings: BookingListItem[] = [
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
    },
    {
      id: '1003',
      detailsRoute: '/my-bookings/1003',
      timeRange: '2026.03.12 08:00 - 2026.03.12 17:00',
      vehicleName: 'Ford Transit',
      status: 'COMPLETED'
    }
  ];
}
