import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-booking-admin-actions',
  standalone: true,
  templateUrl: './booking-admin-actions.html',
  styleUrl: './booking-admin-actions.css'
})
export class BookingAdminActionsComponent {
  @Output() checkout = new EventEmitter<void>();
  @Output() checkin = new EventEmitter<void>();
}
