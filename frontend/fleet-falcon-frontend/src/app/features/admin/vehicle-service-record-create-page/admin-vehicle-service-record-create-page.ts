import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-vehicle-service-record-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-vehicle-service-record-create-page.html',
  styleUrl: './admin-vehicle-service-record-create-page.css'
})
export class AdminVehicleServiceRecordCreatePageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected record = {
    type: '',
    startDate: '',
    endDate: '',
    cost: '',
    description: ''
  };

  protected saveRecord(): void {
    console.log('Create service record for vehicle:', this.vehicleId(), this.record);
  }
}
