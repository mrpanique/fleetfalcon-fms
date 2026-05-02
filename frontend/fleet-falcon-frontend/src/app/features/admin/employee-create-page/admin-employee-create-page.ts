// This is essentially the register page.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminEmployeeUpsertRequest, AdminManagementService, AdminUserCreateRequest } from '../services/admin-management.service';
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
    // user fields
    email: '',
    password: '',
    role: 'EMPLOYEE',
    // employee fields
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    phoneNumber: '',
    drivingLicenseNumber: ''
  };

  protected saveEmployee(): void {
    const userPayload: AdminUserCreateRequest = this.buildUserPayload();
      // client-side required-field validation (drivingLicenseNumber is optional)
      const required = [
        this.employee.email,
        this.employee.password,
        this.employee.firstName,
        this.employee.lastName,
        this.employee.employeeId,
        this.employee.department,
        this.employee.phoneNumber
      ];

      const missing = required.some((v) => !v || v.trim() === '');
      if (missing) {
        this.toastService.error('Please fill in all required fields.');
        return;
      }

    this.adminManagementService.createUser(userPayload).subscribe({
      next: (user) => {
        const payload = this.buildEmployeePayload(user.id);
        this.adminManagementService.createEmployee(payload).subscribe({
          next: () => {
            this.toastService.success('Employee created successfully.');
            this.router.navigate(['/admin/employees']);
          },
          error: (error) => {
            console.error('Failed to create employee after user creation', error);
            alert('Failed to create employee.');
          }
        });
      },
      error: (error) => {
        console.error('Failed to create user', error);
        alert('Failed to create user.');
      }
    });
  }

  private buildUserPayload(): AdminUserCreateRequest {
    return {
      email: this.employee.email.trim(),
      passwordHash: this.employee.password,
      role: (this.employee.role || 'EMPLOYEE') as 'ADMIN' | 'EMPLOYEE'
    };
  }

  private buildEmployeePayload(userId: number): AdminEmployeeUpsertRequest {
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
