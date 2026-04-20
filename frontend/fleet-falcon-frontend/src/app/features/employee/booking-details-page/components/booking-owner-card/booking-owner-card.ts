import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingOwner } from './booking-owner.model';

@Component({
  selector: 'app-booking-owner-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-owner-card.html',
  styleUrl: './booking-owner-card.css'
})
export class BookingOwnerCardComponent {
  @Input({ required: true }) owner!: BookingOwner;
}
