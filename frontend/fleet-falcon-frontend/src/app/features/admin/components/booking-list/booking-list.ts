import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBookingListItem } from '../booking-list-item/booking-list-item.model';
import { AdminBookingListItemComponent } from '../booking-list-item/booking-list-item';

@Component({
  selector: 'app-admin-booking-list',
  standalone: true,
  imports: [CommonModule, AdminBookingListItemComponent],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css'
})
export class AdminBookingListComponent {
  @Input() ariaLabel = 'Bookings list';
  @Input() emptyMessage = 'No bookings found';
  @Input({ required: true }) items: AdminBookingListItem[] = [];
}
