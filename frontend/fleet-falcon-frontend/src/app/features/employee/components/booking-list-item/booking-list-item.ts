import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingListItem } from './booking-list-item.model';
import { StatusIndicatorComponent } from '../../../../core/components/status-indicator/status-indicator';

@Component({
  selector: 'app-booking-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusIndicatorComponent],
  templateUrl: './booking-list-item.html',
  styleUrl: './booking-list-item.css'
})
export class BookingListItemComponent {
  @Input({ required: true }) item!: BookingListItem;

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      ACTIVE: 'Active',
      COMPLETED: 'Completed',
      REJECTED: 'Rejected',
      CANCELLED: 'Cancelled'
    };
    return labels[status] || status;
  }
}
