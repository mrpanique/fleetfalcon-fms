import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminEmployeeListItem } from './employee-list-item.model';

@Component({
  selector: 'app-admin-employee-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list-item.html',
  styleUrl: './employee-list-item.css'
})
export class AdminEmployeeListItemComponent {
  @Input({ required: true }) item!: AdminEmployeeListItem;
}
