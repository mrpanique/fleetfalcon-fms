import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeVehiclesService, VehicleDto } from '../services/employee-vehicles.service';

@Component({
  selector: 'app-employee-vehicles-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './employee-vehicles-page.html',
  styleUrl: './employee-vehicles-page.css'
})
export class EmployeeVehiclesPageComponent {
  private readonly router = inject(Router);
  private readonly employeeVehiclesService = inject(EmployeeVehiclesService);

  protected readonly isAdmin = computed(() => this.router.url.startsWith('/admin/'));
  private readonly vehicles = toSignal(this.employeeVehiclesService.getVehicles(), {
    initialValue: [] as VehicleDto[]
  });

  protected readonly draftSearchTerm = signal('');
  private readonly appliedSearchTerm = signal('');

  protected readonly draftBrands = signal<string[]>([]);
  protected readonly draftVehicleTypes = signal<string[]>([]);
  protected readonly draftFuelTypes = signal<string[]>([]);
  protected readonly draftPriceMin = signal<number | null>(null);
  protected readonly draftPriceMax = signal<number | null>(null);
  protected readonly draftSeatMin = signal<number | null>(null);
  protected readonly draftSeatMax = signal<number | null>(null);
  protected readonly draftAvailableFrom = signal('');
  protected readonly draftAvailableTo = signal('');

  private readonly appliedBrands = signal<string[]>([]);
  private readonly appliedVehicleTypes = signal<string[]>([]);
  private readonly appliedFuelTypes = signal<string[]>([]);
  private readonly appliedPriceMin = signal<number | null>(null);
  private readonly appliedPriceMax = signal<number | null>(null);
  private readonly appliedSeatMin = signal<number | null>(null);
  private readonly appliedSeatMax = signal<number | null>(null);
  private readonly appliedAvailableFrom = signal('');
  private readonly appliedAvailableTo = signal('');

  protected readonly filteredVehicles = computed(() => {
    const vehicles = this.vehicles();
    const searchTerm = this.appliedSearchTerm();

    if (searchTerm) {
      return vehicles.filter((vehicle) => {
        const haystack = `${vehicle.brand} ${vehicle.model}`.toLowerCase();
        return haystack.includes(searchTerm);
      });
    }

    const brands = this.appliedBrands();
    const vehicleTypes = this.appliedVehicleTypes();
    const fuelTypes = this.appliedFuelTypes();
    const priceMin = this.appliedPriceMin();
    const priceMax = this.appliedPriceMax();
    const seatMin = this.appliedSeatMin();
    const seatMax = this.appliedSeatMax();
    const availableFrom = this.parseDate(this.appliedAvailableFrom());
    const availableTo = this.parseDate(this.appliedAvailableTo());

    return vehicles.filter((vehicle) => {
      if (brands.length > 0 && !brands.includes(vehicle.brand.toLowerCase())) {
        return false;
      }

      if (vehicleTypes.length > 0 && !vehicleTypes.includes(vehicle.vehicleType)) {
        return false;
      }

      if (fuelTypes.length > 0 && !fuelTypes.includes(vehicle.fuelType)) {
        return false;
      }

      if (priceMin != null && (vehicle.dailyPrice == null || vehicle.dailyPrice < priceMin)) {
        return false;
      }

      if (priceMax != null && (vehicle.dailyPrice == null || vehicle.dailyPrice > priceMax)) {
        return false;
      }

      if (seatMin != null && (vehicle.seatingCapacity == null || vehicle.seatingCapacity < seatMin)) {
        return false;
      }

      if (seatMax != null && (vehicle.seatingCapacity == null || vehicle.seatingCapacity > seatMax)) {
        return false;
      }

      // "Availability window" is approximated with inspection validity date.
      const inspectionDate = this.parseDate(vehicle.inspectionValidUntil);
      if (availableFrom && (!inspectionDate || inspectionDate < availableFrom)) {
        return false;
      }

      if (availableTo && (!inspectionDate || inspectionDate > availableTo)) {
        return false;
      }

      return true;
    });
  });

  protected setDraftSearchTerm(value: string): void {
    this.draftSearchTerm.set(value);
  }

  protected applySearch(): void {
    this.appliedSearchTerm.set(this.draftSearchTerm().trim().toLowerCase());
    this.resetDraftFilters();
    this.resetAppliedFilters();
  }

  protected applyFilters(): void {
    this.appliedSearchTerm.set('');
    this.draftSearchTerm.set('');

    this.appliedBrands.set([...this.draftBrands()]);
    this.appliedVehicleTypes.set([...this.draftVehicleTypes()]);
    this.appliedFuelTypes.set([...this.draftFuelTypes()]);
    this.appliedPriceMin.set(this.draftPriceMin());
    this.appliedPriceMax.set(this.draftPriceMax());
    this.appliedSeatMin.set(this.draftSeatMin());
    this.appliedSeatMax.set(this.draftSeatMax());
    this.appliedAvailableFrom.set(this.draftAvailableFrom());
    this.appliedAvailableTo.set(this.draftAvailableTo());
  }

  protected isDraftBrandSelected(value: string): boolean {
    return this.draftBrands().includes(value.toLowerCase());
  }

  protected isDraftVehicleTypeSelected(value: string): boolean {
    return this.draftVehicleTypes().includes(value);
  }

  protected isDraftFuelTypeSelected(value: string): boolean {
    return this.draftFuelTypes().includes(value);
  }

  protected toggleDraftBrand(value: string, checked: boolean): void {
    this.draftBrands.update((items) => this.toggleSelection(items, value.toLowerCase(), checked));
  }

  protected toggleDraftVehicleType(value: string, checked: boolean): void {
    this.draftVehicleTypes.update((items) => this.toggleSelection(items, value, checked));
  }

  protected toggleDraftFuelType(value: string, checked: boolean): void {
    this.draftFuelTypes.update((items) => this.toggleSelection(items, value, checked));
  }

  protected setDraftPriceMin(value: unknown): void {
    this.draftPriceMin.set(this.toNullableNumber(value));
  }

  protected setDraftPriceMax(value: unknown): void {
    this.draftPriceMax.set(this.toNullableNumber(value));
  }

  protected setDraftSeatMin(value: unknown): void {
    this.draftSeatMin.set(this.toNullableNumber(value));
  }

  protected setDraftSeatMax(value: unknown): void {
    this.draftSeatMax.set(this.toNullableNumber(value));
  }

  protected setDraftAvailableFrom(value: string): void {
    this.draftAvailableFrom.set(value);
  }

  protected setDraftAvailableTo(value: string): void {
    this.draftAvailableTo.set(value);
  }

  protected vehicleDetailsRoute(id: number): string {
    return this.isAdmin() ? `/admin/vehicles/${id}` : `/vehicles/${id}`;
  }

  protected formatPrice(value: number | null): string {
    if (value == null) {
      return '-';
    }

    return `${value.toLocaleString('hu-HU')} Ft`;
  }

  private toggleSelection(items: string[], value: string, checked: boolean): string[] {
    if (checked) {
      return items.includes(value) ? items : [...items, value];
    }

    return items.filter((item) => item !== value);
  }

  private toNullableNumber(value: unknown): number | null {
    if (value == null || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private parseDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private resetDraftFilters(): void {
    this.draftBrands.set([]);
    this.draftVehicleTypes.set([]);
    this.draftFuelTypes.set([]);
    this.draftPriceMin.set(null);
    this.draftPriceMax.set(null);
    this.draftSeatMin.set(null);
    this.draftSeatMax.set(null);
    this.draftAvailableFrom.set('');
    this.draftAvailableTo.set('');
  }

  private resetAppliedFilters(): void {
    this.appliedBrands.set([]);
    this.appliedVehicleTypes.set([]);
    this.appliedFuelTypes.set([]);
    this.appliedPriceMin.set(null);
    this.appliedPriceMax.set(null);
    this.appliedSeatMin.set(null);
    this.appliedSeatMax.set(null);
    this.appliedAvailableFrom.set('');
    this.appliedAvailableTo.set('');
  }
}
