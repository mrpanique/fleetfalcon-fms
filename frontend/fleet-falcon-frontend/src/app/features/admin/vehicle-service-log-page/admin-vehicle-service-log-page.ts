import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceLogListComponent } from './components/service-log-list/service-log-list';
import { ServiceRecord } from './service-record.model';

@Component({
  selector: 'app-admin-vehicle-service-log-page',
  standalone: true,
  imports: [CommonModule, ServiceLogListComponent],
  templateUrl: './admin-vehicle-service-log-page.html',
  styleUrl: './admin-vehicle-service-log-page.css',
})
export class AdminVehicleServiceLogPageComponent implements OnInit {
  vehicleId = signal<string>('');
  protected expandedItemId = signal<string | null>(null);

  // Mock service records
  protected serviceRecords = signal<ServiceRecord[]>([
    {
      id: 'SL-001',
      type: 'Oil Change',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      cost: 45.99,
      description: 'Regular oil and filter change. Used synthetic 5W-30 oil (5 quarts). Rotated tires and checked pressure. All fluids topped up.',
    },
    {
      id: 'SL-002',
      type: 'Tire Rotation',
      startDate: '2024-03-10',
      endDate: '2024-03-10',
      cost: 75.0,
      description: 'Rotated all four tires, balanced wheels, and replaced two worn brake pads. Inspection found no issues.',
    },
    {
      id: 'SL-003',
      type: 'Inspection',
      startDate: '2024-06-20',
      endDate: '2024-06-20',
      cost: 0.0,
      description: 'Annual safety inspection passed. Brakes in good condition. Battery voltage: 12.8V. All lights operational.',
    },
    {
      id: 'SL-004',
      type: 'Transmission Service',
      startDate: '2024-09-05',
      endDate: '2024-09-06',
      cost: 250.0,
      description: 'Replaced transmission fluid and filter. Checked transmission cooler lines. System diagnostic completed with all parameters within normal range.',
    },
    {
      id: 'SL-005',
      type: 'Brake Service',
      startDate: '2024-12-01',
      endDate: '2024-12-02',
      cost: 180.5,
      description: 'Front brake pads and rotors replaced. Bled brake lines to remove air. Rear brakes inspected and cleaned. Test drive completed successfully.',
    },
  ]);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.vehicleId.set(params.get('id') || '');
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
}
