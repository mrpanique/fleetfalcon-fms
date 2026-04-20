import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';

@Component({
  selector: 'app-admin-vehicle-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-edit-page.html',
  styleUrl: './admin-vehicle-edit-page.css'
})
export class AdminVehicleEditPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected vehicle = {
    brand: 'Toyota',
    model: 'Corolla',
    vehicleType: 'CAR',
    fuelType: 'HYBRID',
    releaseYear: 2022,
    dailyPrice: 18000,
    seatingCapacity: 5,
    licensePlate: 'ABC-123',
    description:
      'Comfortable hybrid sedan for city and intercity travel. Includes rear camera, parking sensors, and automatic climate control.',
    status: 'AVAILABLE',
    currentMileage: 42800,
    inspectionValidUntil: '2027-03-15',
    nextServiceMileage: 50000,
    nextServiceDate: '2026-09-01'
  };

  protected saveVehicle(): void {
    // UI-only placeholder until backend integration is added.
    console.log('Save vehicle', this.vehicle);
  }
}
