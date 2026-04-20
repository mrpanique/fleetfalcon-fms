import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRecord } from '../../service-record.model';
import { ServiceLogItemComponent } from '../service-log-item/service-log-item';

@Component({
  selector: 'app-service-log-list',
  standalone: true,
  imports: [CommonModule, ServiceLogItemComponent],
  templateUrl: './service-log-list.html',
  styleUrl: './service-log-list.css'
})
export class ServiceLogListComponent {
  @Input({ required: true }) records: ServiceRecord[] = [];
  @Input() expandedRecordId: string | null = null;

  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
}
