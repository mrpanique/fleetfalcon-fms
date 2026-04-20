import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminBookingListItem } from './booking-list-item.model';

@Component({
  selector: 'app-admin-booking-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-list-item.html',
  styleUrl: './booking-list-item.css'
})
export class AdminBookingListItemComponent {
  @Input({ required: true }) item!: AdminBookingListItem;

  protected statusClass(status: AdminBookingListItem['status']): string {
    return `status-${status}`;
  }

  protected statusLabel(status: AdminBookingListItem['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
