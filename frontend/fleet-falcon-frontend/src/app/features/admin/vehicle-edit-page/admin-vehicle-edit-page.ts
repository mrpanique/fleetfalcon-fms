import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminManagementService, AdminVehicleUpsertRequest } from '../services/admin-management.service';

@Component({
  selector: 'app-admin-vehicle-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-edit-page.html',
  styleUrl: './admin-vehicle-edit-page.css'
})
export class AdminVehicleEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected vehicle = {
    brand: '',
    model: '',
    vehicleType: 'CAR',
    fuelType: 'PETROL',
    releaseYear: new Date().getFullYear(),
    dailyPrice: 0,
    seatingCapacity: 4,
    licensePlate: '',
    description: '',
    status: 'AVAILABLE',
    currentMileage: 0,
    inspectionValidUntil: '',
    nextServiceMileage: 0,
    nextServiceDate: ''
  };

  ngOnInit(): void {
    const id = this.toRouteNumber(this.vehicleId());
    if (id == null) {
      return;
    }

    this.adminManagementService.getVehicleById(id).subscribe({
      next: (vehicle) => {
        this.vehicle = {
          brand: vehicle.brand,
          model: vehicle.model,
          vehicleType: vehicle.vehicleType,
          fuelType: vehicle.fuelType,
          releaseYear: vehicle.releaseYear ?? new Date().getFullYear(),
          dailyPrice: vehicle.dailyPrice ?? 0,
          seatingCapacity: vehicle.seatingCapacity ?? 0,
          licensePlate: vehicle.licensePlate,
          description: vehicle.description ?? '',
          status: vehicle.status,
          currentMileage: vehicle.currentMileage ?? 0,
          inspectionValidUntil: this.toDateInputValue(vehicle.inspectionValidUntil),
          nextServiceMileage: vehicle.nextServiceMileage ?? 0,
          nextServiceDate: this.toDateInputValue(vehicle.nextServiceDate)
        };
      },
      error: (error) => {
        console.error(`Failed to load vehicle ${id}`, error);
      }
    });
  }

  protected saveVehicle(): void {
    const id = this.toRouteNumber(this.vehicleId());
    if (id == null) {
      return;
    }

    const payload = this.buildPayload();
    this.adminManagementService.updateVehicle(id, payload).subscribe({
      next: () => {
        this.router.navigate(['/admin/vehicles', id]);
      },
      error: (error) => {
        console.error(`Failed to update vehicle ${id}`, error);
        alert('Failed to update vehicle.');
      }
    });
  }

  private buildPayload(): AdminVehicleUpsertRequest {
    return {
      brand: this.vehicle.brand.trim(),
      model: this.vehicle.model.trim(),
      vehicleType: this.toEnumValue(this.vehicle.vehicleType),
      fuelType: this.toEnumValue(this.vehicle.fuelType),
      releaseYear: this.toNullableNumber(this.vehicle.releaseYear),
      dailyPrice: this.toNullableNumber(this.vehicle.dailyPrice),
      seatingCapacity: this.toNullableNumber(this.vehicle.seatingCapacity),
      licensePlate: this.vehicle.licensePlate.trim(),
      description: this.toNullableString(this.vehicle.description),
      status: this.toEnumValue(this.vehicle.status),
      currentMileage: this.toNullableNumber(this.vehicle.currentMileage),
      inspectionValidUntil: this.toNullableString(this.vehicle.inspectionValidUntil),
      nextServiceMileage: this.toNullableNumber(this.vehicle.nextServiceMileage),
      nextServiceDate: this.toNullableString(this.vehicle.nextServiceDate)
    };
  }

  private toDateInputValue(value: string | null): string {
    if (!value) {
      return '';
    }

    return value.slice(0, 10);
  }

  private toNullableString(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }

  private toRouteNumber(value: string): number | null {
    return this.toNullableNumber(value);
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
