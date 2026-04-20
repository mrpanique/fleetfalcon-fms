import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-employee-vehicle-details-page',
  imports: [RouterLink],
  templateUrl: './employee-vehicle-details-page.html',
  styleUrl: './employee-vehicle-details-page.css'
})
export class EmployeeVehicleDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? 'N/A')),
    { initialValue: 'N/A' }
  );

  protected readonly isAdmin = computed(() => {
    return this.router.url.includes('/admin/');
  });
}
