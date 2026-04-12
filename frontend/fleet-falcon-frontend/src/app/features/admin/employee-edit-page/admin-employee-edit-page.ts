import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AdminFormLayoutComponent } from '../components/form-layout/admin-form-layout';

@Component({
  selector: 'app-admin-employee-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminFormLayoutComponent],
  templateUrl: './admin-employee-edit-page.html',
  styleUrl: './admin-employee-edit-page.css'
})
export class AdminEmployeeEditPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly employeeIdFromRoute = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected employee = {
    employeeId: 'EMP-001',
    firstName: 'John',
    lastName: 'Smith',
    department: 'Logistics',
    phoneNumber: '+36 30 123 4567',
    drivingLicenseNumber: 'DL-458721'
  };

  protected saveEmployee(): void {
    // UI-only placeholder until backend integration is added.
    console.log('Save employee', this.employee);
  }
}
