import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BookingListItem } from '../components/booking-list-item/booking-list-item.model';
import { AdminBookingStatus } from '../../admin/components/booking-list-item/booking-list-item.model';
import { environment } from '../../../../environments/environment';

export interface ApiBookingVehicle {
  id: number;
  brand: string;
  model: string;
  vehicleType?: string;
  fuelType?: string;
  seatingCapacity?: number | null;
  dailyPrice?: number | null;
}

export interface ApiBookingEmployee {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  department?: string | null;
  phoneNumber?: string;
  drivingLicenseNumber?: string | null;
  user?: {
    role?: string;
  } | null;
}

export interface ApiBooking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  startMileage?: number | null;
  endMileage?: number | null;
  distanceTraveled?: number | null;
  cost?: number | null;
  employee: ApiBookingEmployee | null;
  vehicle: ApiBookingVehicle | null;
}

export interface BookingFilters {
  status?: 'all' | AdminBookingStatus | null;
  employeeName?: string | null;
  employeeId?: string | null;
}

interface ApiEmployee {
  id: number;
  employeeId: string;
}

export interface CreateBookingRequest {
  vehicleId: number;
  employeeId: number;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeBookingsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiUrl;

  getBookings(filters?: BookingFilters): Observable<ApiBooking[]> {
    let params = new HttpParams();

    if (filters?.status && filters.status !== 'all') {
      params = params.set('status', filters.status.toUpperCase());
    }

    if (filters?.employeeName) {
      params = params.set('employeeName', filters.employeeName);
    }

    if (filters?.employeeId) {
      params = params.set('employeeId', filters.employeeId);
    }

    return this.http.get<ApiBooking[]>(`${this.apiBaseUrl}/api/bookings`, { params }).pipe(
      catchError((error) => {
        console.error('Failed to load bookings', error);
        return of([] as ApiBooking[]);
      })
    );
  }

  getBookingsByEmployeeId(employeeId: string): Observable<BookingListItem[]> {
    return this.getBookings({ employeeId }).pipe(
      map((bookings) => bookings.map((booking) => this.toBookingListItem(booking))),
      catchError((error) => {
        console.error(`Failed to load bookings for employeeId ${employeeId}`, error);
        return of([] as BookingListItem[]);
      })
    );
  }

  createBooking(payload: CreateBookingRequest): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings`, payload);
  }

  getBookingById(id: number): Observable<ApiBooking | null> {
    return this.getBookings().pipe(
      map((bookings) => bookings.find((booking) => booking.id === id) ?? null),
      catchError((error) => {
        console.error(`Failed to load booking ${id}`, error);
        return of(null);
      })
    );
  }

  approveBooking(id: number): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings/${id}/approve`, {});
  }

  rejectBooking(id: number): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings/${id}/reject`, {});
  }

  cancelBooking(id: number): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings/${id}/cancel`, {});
  }

  startBooking(id: number, mileage: number): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings/${id}/start`, {}, {
      params: { mileage }
    });
  }

  endBooking(id: number, mileage: number): Observable<ApiBooking> {
    return this.http.post<ApiBooking>(`${this.apiBaseUrl}/api/bookings/${id}/end`, {}, {
      params: { mileage }
    });
  }

  resolveEmployeeDbIdByEmployeeCode(employeeCode: string): Observable<number | null> {
    return this.http.get<ApiEmployee[]>(`${this.apiBaseUrl}/api/employees`, {
      params: { employeeId: employeeCode }
    }).pipe(
      map((employees) => employees[0]?.id ?? null),
      catchError((error) => {
        console.error(`Failed to resolve employee id for code ${employeeCode}`, error);
        return of(null);
      })
    );
  }

  private toBookingListItem(booking: ApiBooking): BookingListItem {
    return {
      id: String(booking.id),
      detailsRoute: `/my-bookings/${booking.id}`,
      timeRange: `${this.formatDateTime(booking.startDate)} - ${this.formatDateTime(booking.endDate)}`,
      vehicleName: this.getVehicleName(booking.vehicle),
      status: this.toBookingListStatus(booking.status)
    };
  }

  private getVehicleName(vehicle: ApiBookingVehicle | null): string {
    if (!vehicle) {
      return 'Unknown vehicle';
    }

    return `${vehicle.brand} ${vehicle.model}`;
  }

  private toBookingListStatus(status: string): BookingListItem['status'] {
    const normalized = (status || '').toUpperCase();
    const allowed: BookingListItem['status'][] = ['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED'];
    return allowed.includes(normalized as BookingListItem['status']) ? (normalized as BookingListItem['status']) : 'PENDING';
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }
}