import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-bookings-page.html',
  styleUrl: './admin-bookings-page.css'
})
export class AdminBookingsPageComponent {
  protected readonly statusFilter = signal<'all' | BookingStatus>('all');
  protected readonly employeeNameFilter = signal('');
  protected readonly employeeIdFilter = signal('');
  protected readonly draftStatusFilter = signal<'all' | BookingStatus>('all');
  protected readonly draftEmployeeNameFilter = signal('');
  protected readonly draftEmployeeIdFilter = signal('');

  protected readonly bookings = signal<AdminBookingItem[]>([
    {
      id: '2001',
      employeeName: 'John Smith',
      employeeId: 'EMP-001',
      vehicleName: 'Toyota Corolla',
      startDate: '2026.04.02 08:30',
      endDate: '2026.04.03 17:30',
      status: 'pending'
    },
    {
      id: '2002',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP-014',
      vehicleName: 'Volkswagen ID.4',
      startDate: '2026.04.04 09:00',
      endDate: '2026.04.05 18:00',
      status: 'approved'
    },
    {
      id: '2003',
      employeeName: 'Michael Brown',
      employeeId: 'EMP-032',
      vehicleName: 'Ford Transit',
      startDate: '2026.04.06 07:15',
      endDate: '2026.04.06 15:30',
      status: 'completed'
    },
    {
      id: '2004',
      employeeName: 'Emily Davis',
      employeeId: 'EMP-019',
      vehicleName: 'Skoda Octavia',
      startDate: '2026.04.08 06:45',
      endDate: '2026.04.08 14:30',
      status: 'active'
    },
    {
      id: '2005',
      employeeName: 'David Wilson',
      employeeId: 'EMP-044',
      vehicleName: 'Renault Trafic',
      startDate: '2026.04.10 10:00',
      endDate: '2026.04.11 19:00',
      status: 'rejected'
    }
  ]);

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
    this.employeeNameFilter.set(this.draftEmployeeNameFilter());
    this.employeeIdFilter.set(this.draftEmployeeIdFilter());
  }

  protected getStatusClass(status: BookingStatus): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      case 'active':
        return 'status-active';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  protected getStatusLabel(status: BookingStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
