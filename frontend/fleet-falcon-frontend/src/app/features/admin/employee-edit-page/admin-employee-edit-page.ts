import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';
import { AdminEmployeeUpsertRequest, AdminManagementService } from '../services/admin-management.service';

@Component({
  selector: 'app-admin-employee-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-employee-edit-page.html',
  styleUrl: './admin-employee-edit-page.css'
})
export class AdminEmployeeEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminManagementService = inject(AdminManagementService);

  protected readonly employeeIdFromRoute = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    phoneNumber: '',
    drivingLicenseNumber: '',
    userId: ''
  };

  private loadedUserId: number | null = null;

  ngOnInit(): void {
    const id = this.toRouteNumber(this.employeeIdFromRoute());
    if (id == null) {
      return;
    }

    this.adminManagementService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.loadedUserId = employee.user?.id ?? null;
        this.employee = {
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          department: employee.department ?? '',
          phoneNumber: employee.phoneNumber,
          drivingLicenseNumber: employee.drivingLicenseNumber ?? '',
          userId: employee.user?.id != null ? String(employee.user.id) : ''
        };
      },
      error: (error) => {
        console.error(`Failed to load employee ${id}`, error);
      }
    });
  }

  protected saveEmployee(): void {
    const id = this.toRouteNumber(this.employeeIdFromRoute());
    if (id == null) {
      return;
    }

    const payload = this.buildPayload();
    if (!payload) {
      alert('User ID is required to update an employee.');
      return;
    }

    this.adminManagementService.updateEmployee(id, payload).subscribe({
      next: () => {
        this.router.navigate(['/admin/employees']);
      },
      error: (error) => {
        console.error(`Failed to update employee ${id}`, error);
        alert('Failed to update employee.');
      }
    });
  }

  private buildPayload(): AdminEmployeeUpsertRequest | null {
    const userId = this.toNullableNumber(this.employee.userId) ?? this.loadedUserId;
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
}
