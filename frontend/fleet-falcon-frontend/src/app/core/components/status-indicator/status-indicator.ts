import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-indicator.html',
  styleUrl: './status-indicator.css'
})
export class StatusIndicatorComponent {
  @Input({ required: true }) status!: string;

  protected normalize(status: string): string {
    return status.toUpperCase();
  }

  protected getLabel(status: string): string {
    const normalized = this.normalize(status);
    const labels: Record<string, string> = {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      ACTIVE: 'Active',
      COMPLETED: 'Completed',
      REJECTED: 'Rejected',
      CANCELLED: 'Cancelled'
    };
    return labels[normalized] || normalized;
  }

  protected getClass(status: string): string {
    return `status-${this.normalize(status).toLowerCase()}`;
  }
}
