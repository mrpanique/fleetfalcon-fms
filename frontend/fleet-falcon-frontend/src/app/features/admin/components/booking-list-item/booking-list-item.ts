import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminBookingListItem } from './booking-list-item.model';
import { StatusIndicatorComponent } from '../../../../core/components/status-indicator/status-indicator';

@Component({
  selector: 'app-admin-booking-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusIndicatorComponent],
  templateUrl: './booking-list-item.html',
  styleUrl: './booking-list-item.css'
})
export class AdminBookingListItemComponent {
  @Input({ required: true }) item!: AdminBookingListItem;
}
