import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminEmployeeUpsertRequest, AdminManagementService } from '../services/admin-management.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-employee-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-employee-create-page.html',
  styleUrl: './admin-employee-create-page.css'
})
export class AdminEmployeeCreatePageComponent {
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);
  private readonly toastService = inject(ToastService);

  protected employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    phoneNumber: '',
    drivingLicenseNumber: '',
    userId: ''
  };

  protected saveEmployee(): void {
    const payload = this.buildPayload();
    if (!payload) {
      alert('User ID is required to create an employee.');
      return;
    }

    this.adminManagementService.createEmployee(payload).subscribe({
      next: () => {
        this.toastService.success('Employee created successfully.');
        this.router.navigate(['/admin/employees']);
      },
      error: (error) => {
        console.error('Failed to create employee', error);
        alert('Failed to create employee.');
      }
    });
  }

  private buildPayload(): AdminEmployeeUpsertRequest | null {
    const userId = this.toNullableNumber(this.employee.userId);
    if (userId == null) {
      return null;
    }

    return {
      employeeId: this.employee.employeeId.trim(),
      firstName: this.employee.firstName.trim(),
      lastName: this.employee.lastName.trim(),
      department: this.toNullableString(this.employee.department),
      phoneNumber: this.employee.phoneNumber.trim(),
      drivingLicenseNumber: this.toNullableString(this.employee.drivingLicenseNumber),
      user: { id: userId }
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
}
