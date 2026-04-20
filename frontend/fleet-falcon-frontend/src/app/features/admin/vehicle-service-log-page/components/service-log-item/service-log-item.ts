import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRecord } from '../../service-record.model';

@Component({
  selector: 'app-service-log-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-log-item.html',
  styleUrl: './service-log-item.css'
})
export class ServiceLogItemComponent {
  @Input({ required: true }) record!: ServiceRecord;
  @Input() expanded = false;

  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  protected onToggle(): void {
    this.toggle.emit(this.record.id);
  }

  protected onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.record.id);
  }
}
