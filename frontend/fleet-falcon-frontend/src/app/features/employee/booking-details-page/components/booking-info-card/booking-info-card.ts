import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingAdminActionsComponent } from '../booking-admin-actions/booking-admin-actions';

@Component({
  selector: 'app-booking-info-card',
  standalone: true,
  imports: [CommonModule, BookingAdminActionsComponent],
  templateUrl: './booking-info-card.html',
  styleUrl: './booking-info-card.css'
})
export class BookingInfoCardComponent {
  @Input() isAdmin = false;
  @Input() status = 'Approved';
  @Input() cost = '54 000 Ft';
  @Input() timePeriod = '2026.03.31 09:00 - 2026.04.01 18:00';

  @Output() checkout = new EventEmitter<void>();
  @Output() checkin = new EventEmitter<void>();
}
