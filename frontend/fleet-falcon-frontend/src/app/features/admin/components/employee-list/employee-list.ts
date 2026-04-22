import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminEmployeeListItemComponent } from '../employee-list-item/employee-list-item';
import { AdminEmployeeListItem } from '../employee-list-item/employee-list-item.model';

@Component({
  selector: 'app-admin-employee-list',
  standalone: true,
  imports: [CommonModule, AdminEmployeeListItemComponent],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class AdminEmployeeListComponent {
  @Input({ required: true }) employees!: AdminEmployeeListItem[];
  @Output() delete = new EventEmitter<string>();
}
