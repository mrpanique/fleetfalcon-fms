import { Component } from '@angular/core';
import { AdminBookingListComponent } from '../components/booking-list/booking-list';
import { AdminBookingListItem } from '../components/booking-list-item/booking-list-item.model';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [AdminBookingListComponent],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPageComponent {
  protected pendingBookings: AdminBookingListItem[] = [
    {
      id: '1',
      detailsRoute: '/admin/bookings/1',
      ariaLabel: 'Pending booking from John Smith for Toyota Corolla',
      employeeName: 'John Smith',
      employeeId: 'EMP-001',
      vehicleName: 'Toyota Corolla',
      dateRange: '2026-04-01 - 2026-04-03',
      status: 'pending',
      highlightPending: true
    },
    {
      id: '2',
      detailsRoute: '/admin/bookings/2',
      ariaLabel: 'Pending booking from Sarah Johnson for Mercedes-Benz C-Class',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP-014',
      vehicleName: 'Mercedes-Benz C-Class',
      dateRange: '2026-04-02 - 2026-04-05',
      status: 'pending',
      highlightPending: true
    },
    {
      id: '3',
      detailsRoute: '/admin/bookings/3',
      ariaLabel: 'Pending booking from Michael Brown for BMW X5',
      employeeName: 'Michael Brown',
      employeeId: 'EMP-032',
      vehicleName: 'BMW X5',
      dateRange: '2026-03-30 - 2026-04-02',
      status: 'pending',
      highlightPending: true
    }
  ];

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
}
