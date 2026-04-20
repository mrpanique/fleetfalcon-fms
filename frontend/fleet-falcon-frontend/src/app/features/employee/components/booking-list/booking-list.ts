import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingListItem } from '../booking-list-item/booking-list-item.model';
import { BookingListItemComponent } from '../booking-list-item/booking-list-item';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, BookingListItemComponent],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css'
})
export class BookingListComponent {
  @Input() ariaLabel = 'Booking list';
  @Input({ required: true }) items: BookingListItem[] = [];
}
