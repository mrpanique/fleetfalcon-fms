import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-employee-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-employee-create-page.html',
  styleUrl: './admin-employee-create-page.css'
})
export class AdminEmployeeCreatePageComponent {
  protected employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    phoneNumber: '',
    drivingLicenseNumber: ''
  };

  protected saveEmployee(): void {
    // UI-only placeholder until backend integration is added.
    console.log('Create employee', this.employee);
  }
}
