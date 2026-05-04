import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminMaintenanceLogUpsertRequest, AdminManagementService } from '../services/admin-management.service';

@Component({
  selector: 'app-admin-vehicle-service-record-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-service-record-edit-page.html',
  styleUrl: './admin-vehicle-service-record-edit-page.css'
})
export class AdminVehicleServiceRecordEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected readonly recordId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('recordId') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected record = {
    type: '',
    startDate: '',
    endDate: '',
    cost: '',
    description: ''
  };

  ngOnInit(): void {
    const id = this.toNullableNumber(this.recordId());
    if (id == null) {
      return;
    }

    this.adminManagementService.getMaintenanceLogById(id).subscribe({
      next: (record) => {
        this.record = {
          type: record.type,
          startDate: this.toDateInputValue(record.startDate),
          endDate: this.toDateInputValue(record.endDate),
          cost: String(record.cost),
          description: record.description ?? ''
        };
      },
      error: (error) => {
        console.error(`Failed to load service record ${id}`, error);
      }
    });
  }

  protected saveRecord(): void {
    const id = this.toNullableNumber(this.recordId());
    const payload = this.buildPayload();

    if (id == null || !payload) {
      alert('Vehicle ID, record ID and valid cost are required.');
      return;
    }

    this.adminManagementService.updateMaintenanceLog(id, payload).subscribe({
      next: () => {
        this.router.navigate(['/admin/vehicles', this.vehicleId(), 'service-log']);
      },
      error: (error) => {
        console.error(`Failed to update service record ${id}`, error);
        alert('Failed to update service record.');
      }
    });
  }

  private buildPayload(): AdminMaintenanceLogUpsertRequest | null {
    const vehicleId = this.toNullableNumber(this.vehicleId());
    const cost = this.toNullableNumber(this.record.cost);
    if (vehicleId == null || cost == null) {
      return null;
    }

    return {
      vehicle: { id: vehicleId },
      type: this.toEnumValue(this.record.type),
      startDate: this.toDateTime(this.record.startDate),
      endDate: this.toDateTime(this.record.endDate),
      cost: Math.round(cost),
      description: this.toNullableString(this.record.description)
    };
  }

  private toDateInputValue(value: string | null): string {
    if (!value) {
      return '';
    }

    return value.slice(0, 10);
  }

  private toDateTime(value: string): string {
    const trimmed = value.trim();
    return trimmed.includes('T') ? trimmed : `${trimmed}T00:00:00`;
  }

  private toNullableString(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value == null || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toEnumValue(value: string): string {
    return value.trim().toUpperCase().replace(/\s+/g, '_');
  }
}
