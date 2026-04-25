import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceLogListComponent } from './components/service-log-list/service-log-list';
import { ServiceRecord } from './service-record.model';
import { AdminMaintenanceLogDto, AdminManagementService } from '../services/admin-management.service';

@Component({
  selector: 'app-admin-vehicle-service-log-page',
  standalone: true,
  imports: [CommonModule, ServiceLogListComponent],
  templateUrl: './admin-vehicle-service-log-page.html',
  styleUrl: './admin-vehicle-service-log-page.css',
})
export class AdminVehicleServiceLogPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);

  vehicleId = signal<string>('');
  protected expandedItemId = signal<string | null>(null);

  protected serviceRecords = signal<ServiceRecord[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.vehicleId.set(params.get('id') || '');
      this.loadServiceRecords();
    });
  }

  toggleExpand(recordId: string): void {
    this.expandedItemId.set(
      this.expandedItemId() === recordId ? null : recordId
    );
  }

  addNewServiceRecord(): void {
    this.router.navigate(['/admin/vehicles', this.vehicleId(), 'service-log', 'new']);
  }

  editServiceRecord(recordId: string): void {
    this.router.navigate(['/admin/vehicles', this.vehicleId(), 'service-log', recordId, 'edit']);
  }

  private loadServiceRecords(): void {
    const vehicleId = Number(this.vehicleId());
    if (!Number.isFinite(vehicleId)) {
      this.serviceRecords.set([]);
      return;
    }

    this.adminManagementService.getMaintenanceLogs().subscribe({
      next: (records) => {
        const filtered = records
          .filter((record) => record.vehicle?.id === vehicleId)
          .map((record) => this.toServiceRecord(record));
        this.serviceRecords.set(filtered);
      },
      error: (error) => {
        console.error(`Failed to load service logs for vehicle ${vehicleId}`, error);
        this.serviceRecords.set([]);
      }
    });
  }

  private toServiceRecord(record: AdminMaintenanceLogDto): ServiceRecord {
    return {
      id: String(record.id),
      type: record.type,
      startDate: this.toDateInputValue(record.startDate),
      endDate: this.toDateInputValue(record.endDate),
      cost: record.cost,
      description: record.description ?? ''
    };
  }

  private toDateInputValue(value: string): string {
    return value.slice(0, 10);
  }
}
