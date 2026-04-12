import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';

@Component({
  selector: 'app-admin-vehicle-service-record-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-service-record-edit-page.html',
  styleUrl: './admin-vehicle-service-record-edit-page.css'
})
export class AdminVehicleServiceRecordEditPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected readonly recordId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('recordId') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected record = {
    type: 'Oil Change',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    cost: '45.99',
    description: 'Regular oil and filter change. Used synthetic 5W-30 oil (5 quarts). Rotated tires and checked pressure. All fluids topped up.'
  };

  protected saveRecord(): void {
    console.log('Save service record:', this.recordId(), this.record);
  }
}
