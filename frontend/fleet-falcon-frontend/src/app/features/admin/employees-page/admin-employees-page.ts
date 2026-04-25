import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminEmployeeListComponent } from '../components/employee-list/employee-list';
import { AdminEmployeeListItem } from '../components/employee-list-item/employee-list-item.model';
import { AdminEmployeeDto, AdminManagementService } from '../services/admin-management.service';

@Component({
  selector: 'app-admin-employees-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminEmployeeListComponent],
  templateUrl: './admin-employees-page.html',
  styleUrl: './admin-employees-page.css'
})
export class AdminEmployeesPageComponent implements OnInit {
  private readonly adminManagementService = inject(AdminManagementService);

  protected readonly nameFilter = signal('');
  protected readonly employeeIdFilter = signal('');

  protected readonly employees = signal<AdminEmployeeListItem[]>([]);

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected setNameFilter(value: string): void {
    this.nameFilter.set(value);
    this.loadEmployees();
  }

  protected setEmployeeIdFilter(value: string): void {
    this.employeeIdFilter.set(value);
    this.loadEmployees();
  }

  protected deleteEmployee(employeeId: string): void {
    const employee = this.employees().find((item) => item.id === employeeId);
    if (!employee) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete employee "${employee.name}" (${employee.employeeId})?`
    );

    if (!shouldDelete) {
      return;
    }

    const employeeDbId = Number(employeeId);
    if (!Number.isFinite(employeeDbId)) {
      return;
    }

    this.adminManagementService.deleteEmployee(employeeDbId).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: (error) => {
        console.error(`Failed to delete employee ${employeeDbId}`, error);
        alert('Failed to delete employee.');
      }
    });
  }

  private loadEmployees(): void {
    this.adminManagementService.getEmployees({
      name: this.nameFilter().trim() || null,
      employeeId: this.employeeIdFilter().trim() || null
    }).subscribe({
      next: (employees) => {
        this.employees.set(employees.map((employee) => this.toListItem(employee)));
      },
      error: (error) => {
        console.error('Failed to load employees', error);
        this.employees.set([]);
      }
    });
  }

  private toListItem(employee: AdminEmployeeDto): AdminEmployeeListItem {
    return {
      id: String(employee.id),
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      role: employee.user?.role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      employeeId: employee.employeeId,
      department: employee.department ?? '-',
      phoneNumber: employee.phoneNumber,
      drivingLicenseNumber: employee.drivingLicenseNumber ?? '-'
    };
  }
}
