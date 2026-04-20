import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-vehicles-page',
  imports: [RouterLink],
  templateUrl: './employee-vehicles-page.html',
  styleUrl: './employee-vehicles-page.css'
})
export class EmployeeVehiclesPageComponent {
  private readonly router = inject(Router);

  protected readonly isAdmin = computed(() => this.router.url.startsWith('/admin/'));

  protected vehicleDetailsRoute(id: string): string {
    return this.isAdmin() ? `/admin/vehicles/${id}` : `/vehicles/${id}`;
  }
}
