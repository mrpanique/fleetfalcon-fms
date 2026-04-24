import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BookingListItem } from '../components/booking-list-item/booking-list-item.model';

interface ApiBookingVehicle {
  brand: string;
  model: string;
}

interface ApiBooking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  vehicle: ApiBookingVehicle | null;
}

@Injectable({ providedIn: 'root' })
export class EmployeeBookingsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080';

  getBookingsByEmployeeId(employeeId: string): Observable<BookingListItem[]> {
    return this.http.get<ApiBooking[]>(`${this.apiBaseUrl}/api/bookings`, {
      params: { employeeId }
    }).pipe(
      map((bookings) => bookings.map((booking) => this.toBookingListItem(booking))),
      catchError((error) => {
        console.error(`Failed to load bookings for employeeId ${employeeId}`, error);
        return of([] as BookingListItem[]);
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
    if (status === 'APPROVED' || status === 'PENDING' || status === 'COMPLETED') {
      return status;
    }

    return 'PENDING';
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