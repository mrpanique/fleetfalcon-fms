import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type EmployeeRole = 'EMPLOYEE' | 'ADMIN';

interface EmployeeListItem {
  id: string;
  name: string;
  role: EmployeeRole;
  employeeId: string;
  department: string;
  phoneNumber: string;
  drivingLicenseNumber: string;
}

@Component({
  selector: 'app-admin-employees-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-employees-page.html',
  styleUrl: './admin-employees-page.css'
})
export class AdminEmployeesPageComponent {
  protected readonly nameFilter = signal('');
  protected readonly employeeIdFilter = signal('');

  protected readonly employees = signal<EmployeeListItem[]>([
    {
      id: 'u1',
      name: 'John Smith',
      role: 'EMPLOYEE',
      employeeId: 'EMP-001',
      department: 'Logistics',
      phoneNumber: '+36 30 123 4567',
      drivingLicenseNumber: 'DL-458721'
    },
    {
      id: 'u2',
      name: 'Sarah Johnson',
      role: 'EMPLOYEE',
      employeeId: 'EMP-014',
      department: 'Sales',
      phoneNumber: '+36 30 765 1122',
      drivingLicenseNumber: 'DL-771209'
    },
    {
      id: 'u3',
      name: 'Michael Brown',
      role: 'ADMIN',
      employeeId: 'ADM-002',
      department: 'Fleet Operations',
      phoneNumber: '+36 20 445 7788',
      drivingLicenseNumber: 'DL-225610'
    },
    {
      id: 'u4',
      name: 'Emily Davis',
      role: 'EMPLOYEE',
      employeeId: 'EMP-019',
      department: 'Procurement',
      phoneNumber: '+36 70 889 3311',
      drivingLicenseNumber: 'DL-663904'
    },
    {
      id: 'u5',
      name: 'David Wilson',
      role: 'EMPLOYEE',
      employeeId: 'EMP-044',
      department: 'Support',
      phoneNumber: '+36 30 512 0033',
      drivingLicenseNumber: 'DL-910477'
    }
  ]);

  protected readonly filteredEmployees = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const employeeId = this.employeeIdFilter().trim().toLowerCase();

    return this.employees().filter((employee) => {
      const nameMatches = !name || employee.name.toLowerCase().includes(name);
      const idMatches = !employeeId || employee.employeeId.toLowerCase().includes(employeeId);

      return nameMatches && idMatches;
    });
  });

  protected setNameFilter(value: string): void {
    this.nameFilter.set(value);
  }

  protected setEmployeeIdFilter(value: string): void {
    this.employeeIdFilter.set(value);
  }
}
