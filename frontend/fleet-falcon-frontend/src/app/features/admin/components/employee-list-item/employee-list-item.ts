import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() delete = new EventEmitter<string>();

  protected onDelete(event: Event): void {
    event.preventDefault();
    this.delete.emit(this.item.id);
  }
}
