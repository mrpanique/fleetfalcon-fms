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
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  protected showValidationErrors = false;

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
    this.showValidationErrors = true;

    if (!this.isEmailValid()) {
      return;
    }

    if (!this.isPasswordValid()) {
      return;
    }

    const required = [
      this.employee.firstName,
      this.employee.lastName,
      this.employee.employeeId,
      this.employee.department,
      this.employee.phoneNumber
    ];

    const missing = required.some((value) => !value || value.trim() === '');
    if (missing) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    const userPayload: AdminUserCreateRequest = this.buildUserPayload();

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

  protected getEmailError(): string {
    if (!this.showValidationErrors) {
      return '';
    }

    return this.isEmailValid() ? '' : 'Invalid email address';
  }

  protected getPasswordError(): string {
    if (!this.showValidationErrors) {
      return '';
    }

    return this.isPasswordValid() ? '' : 'Min. 8 characters, Min. 1 uppercase letter, Min. 1 number';
  }

  private isEmailValid(): boolean {
    return this.emailPattern.test(this.employee.email.trim());
  }

  private isPasswordValid(): boolean {
    return this.passwordPattern.test(this.employee.password);
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
