import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminUserRef {
  id: number;
  email?: string;
  role?: string;
}

export interface AdminUserCreateRequest {
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface AdminEmployeeDto {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  user: AdminUserRef | null;
  phoneNumber: string;
  drivingLicenseNumber: string | null;
  department: string | null;
}

export interface AdminEmployeeUpsertRequest {
  firstName: string;
  lastName: string;
  employeeId: string;
  user: { id: number } | null;
  phoneNumber: string;
  drivingLicenseNumber: string | null;
  department: string | null;
}

export interface AdminVehicleDto {
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

export interface AdminVehicleUpsertRequest {
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

export interface AdminMaintenanceLogDto {
  id: number;
  vehicle: { id: number } | null;
  type: string;
  startDate: string;
  endDate: string;
  cost: number;
  description: string | null;
}

export interface AdminMaintenanceLogUpsertRequest {
  vehicle: { id: number };
  type: string;
  startDate: string;
  endDate: string;
  cost: number;
  description: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080';

  getEmployees(filters?: { name?: string | null; employeeId?: string | null }): Observable<AdminEmployeeDto[]> {
    let params = new HttpParams();

    if (filters?.name) {
      params = params.set('name', filters.name);
    }

    if (filters?.employeeId) {
      params = params.set('employeeId', filters.employeeId);
    }

    return this.http.get<AdminEmployeeDto[]>(`${this.apiBaseUrl}/api/employees`, { params });
  }

  createEmployee(payload: AdminEmployeeUpsertRequest): Observable<AdminEmployeeDto> {
    return this.http.post<AdminEmployeeDto>(`${this.apiBaseUrl}/api/employees`, payload);
  }

  createUser(payload: AdminUserCreateRequest): Observable<AdminUserRef> {
    return this.http.post<AdminUserRef>(`${this.apiBaseUrl}/api/users`, payload);
  }

  getEmployeeById(id: number): Observable<AdminEmployeeDto> {
    return this.http.get<AdminEmployeeDto>(`${this.apiBaseUrl}/api/employees/${id}`);
  }

  updateEmployee(id: number, payload: AdminEmployeeUpsertRequest): Observable<AdminEmployeeDto> {
    return this.http.put<AdminEmployeeDto>(`${this.apiBaseUrl}/api/employees/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/employees/${id}`);
  }

  createVehicle(payload: AdminVehicleUpsertRequest): Observable<AdminVehicleDto> {
    return this.http.post<AdminVehicleDto>(`${this.apiBaseUrl}/api/vehicles`, payload);
  }

  getVehicleById(id: number): Observable<AdminVehicleDto> {
    return this.http.get<AdminVehicleDto>(`${this.apiBaseUrl}/api/vehicles/${id}`);
  }

  updateVehicle(id: number, payload: AdminVehicleUpsertRequest): Observable<AdminVehicleDto> {
    return this.http.put<AdminVehicleDto>(`${this.apiBaseUrl}/api/vehicles/${id}`, payload);
  }

  getMaintenanceLogs(): Observable<AdminMaintenanceLogDto[]> {
    return this.http.get<AdminMaintenanceLogDto[]>(`${this.apiBaseUrl}/api/maintenance-logs`);
  }

  getMaintenanceLogById(id: number): Observable<AdminMaintenanceLogDto> {
    return this.http.get<AdminMaintenanceLogDto>(`${this.apiBaseUrl}/api/maintenance-logs/${id}`);
  }

  createMaintenanceLog(payload: AdminMaintenanceLogUpsertRequest): Observable<AdminMaintenanceLogDto> {
    return this.http.post<AdminMaintenanceLogDto>(`${this.apiBaseUrl}/api/maintenance-logs`, payload);
  }

  updateMaintenanceLog(id: number, payload: AdminMaintenanceLogUpsertRequest): Observable<AdminMaintenanceLogDto> {
    return this.http.put<AdminMaintenanceLogDto>(`${this.apiBaseUrl}/api/maintenance-logs/${id}`, payload);
  }
}
