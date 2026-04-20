import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingListItem } from './booking-list-item.model';

@Component({
  selector: 'app-booking-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-list-item.html',
  styleUrl: './booking-list-item.css'
})
export class BookingListItemComponent {
  @Input({ required: true }) item!: BookingListItem;

  protected statusLabel(status: BookingListItem['status']): string {
    return status === 'APPROVED' ? 'Approved' : status === 'PENDING' ? 'Pending' : 'Completed';
  }
}
