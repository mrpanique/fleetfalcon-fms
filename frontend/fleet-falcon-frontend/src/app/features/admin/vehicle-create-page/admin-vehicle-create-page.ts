import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminManagementService, AdminVehicleUpsertRequest } from '../services/admin-management.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-vehicle-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-create-page.html',
  styleUrl: './admin-vehicle-create-page.css'
})
export class AdminVehicleCreatePageComponent {
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);
  private readonly toastService = inject(ToastService);

  protected vehicle = {
    brand: '',
    model: '',
    vehicleType: '',
    fuelType: '',
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

  protected saveVehicle(): void {
    const payload = this.buildPayload();

    this.adminManagementService.createVehicle(payload).subscribe({
      next: () => {
        this.toastService.success('Vehicle created successfully.');
        this.router.navigate(['/admin/vehicles']);
      },
      error: (error) => {
        console.error('Failed to create vehicle', error);
        alert('Failed to create vehicle.');
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
