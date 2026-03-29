import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PendingBooking {
  id: string;
  employeeName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminBooking {
  id: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'completed';
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPageComponent {
  pendingBookings: PendingBooking[] = [
    {
      id: '1',
      employeeName: 'John Smith',
      vehicleName: 'Toyota Corolla',
      startDate: '2026-04-01',
      endDate: '2026-04-03',
      status: 'pending'
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      vehicleName: 'Mercedes-Benz C-Class',
      startDate: '2026-04-02',
      endDate: '2026-04-05',
      status: 'pending'
    },
    {
      id: '3',
      employeeName: 'Michael Brown',
      vehicleName: 'BMW X5',
      startDate: '2026-03-30',
      endDate: '2026-04-02',
      status: 'pending'
    }
  ];

  adminBookings: AdminBooking[] = [
    {
      id: '101',
      vehicleName: 'Audi A4',
      startDate: '2026-04-10',
      endDate: '2026-04-12',
      status: 'approved'
    },
    {
      id: '102',
      vehicleName: 'Volkswagen Passat',
      startDate: '2026-04-15',
      endDate: '2026-04-18',
      status: 'approved'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
