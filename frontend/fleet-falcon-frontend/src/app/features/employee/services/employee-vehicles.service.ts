import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VehicleDto {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  vehicleType: string;
  fuelType: string;
  releaseYear: number | null;
  dailyPrice: number | null;
  seatingCapacity: number | null;
  description: string | null;
  status: string;
  currentMileage: number | null;
  inspectionValidUntil: string | null;
  nextServiceMileage: number | null;
  nextServiceDate: string | null;
}

@Injectable({ providedIn: 'root' })
export class EmployeeVehiclesService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiUrl;

  getVehicles(filters?: { availableFrom?: string | null; availableTo?: string | null }): Observable<VehicleDto[]> {
    let params = new HttpParams();
    if (filters?.availableFrom) {
      params = params.set('availableFrom', filters.availableFrom);
    }

    if (filters?.availableTo) {
      params = params.set('availableTo', filters.availableTo);
    }

    return this.http.get<VehicleDto[]>(`${this.apiBaseUrl}/api/vehicles`, { params }).pipe(
      catchError((error) => {
        console.error('Failed to load vehicles', error);
        return of([] as VehicleDto[]);
      })
    );
  }

  getVehicleById(id: string): Observable<VehicleDto | null> {
    return this.http.get<VehicleDto>(`${this.apiBaseUrl}/api/vehicles/${id}`).pipe(
      catchError((error) => {
        console.error(`Failed to load vehicle ${id}`, error);
        return of(null);
      })
    );
  }
}