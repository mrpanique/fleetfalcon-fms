import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeVehiclesService } from '../services/employee-vehicles.service';

@Component({
  selector: 'app-employee-vehicle-details-page',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './employee-vehicle-details-page.html',
  styleUrl: './employee-vehicle-details-page.css'
})
export class EmployeeVehicleDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeVehiclesService = inject(EmployeeVehiclesService);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected readonly vehicle$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => {
      if (!id) {
        return of(null);
      }

      return this.employeeVehiclesService.getVehicleById(id);
    })
  );

  protected readonly isAdmin = computed(() => {
    return this.router.url.includes('/admin/');
  });

  protected formatPrice(value: number | null): string {
    if (value == null) {
      return '-';
    }

    return `${value.toLocaleString('hu-HU')} Ft`;
  }

  protected formatDistance(value: number | null): string {
    if (value == null) {
      return '-';
    }

    return `${value.toLocaleString('hu-HU')} km`;
  }

  protected formatDate(value: string | null): string {
    return value ?? '-';
  }

  protected deleteVehicle(): void {
    if (!this.isAdmin()) {
      return;
    }

    const shouldDelete = window.confirm(`Delete vehicle ${this.vehicleId()}?`);
    if (!shouldDelete) {
      return;
    }

    this.router.navigate(['/admin/vehicles']);
  }
}
