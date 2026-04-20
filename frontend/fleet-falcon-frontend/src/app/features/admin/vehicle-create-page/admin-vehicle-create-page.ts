import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';

@Component({
  selector: 'app-admin-vehicle-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-vehicle-create-page.html',
  styleUrl: './admin-vehicle-create-page.css'
})
export class AdminVehicleCreatePageComponent {
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
    // UI-only placeholder until backend integration is added.
    console.log('Create vehicle', this.vehicle);
  }
}
