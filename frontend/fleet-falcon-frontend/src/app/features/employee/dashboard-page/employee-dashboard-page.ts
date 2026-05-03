import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { EmployeeBookingsService } from '../services/employee-bookings.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-dashboard-page',
  imports: [RouterLink, BookingListComponent, AsyncPipe],
  templateUrl: './employee-dashboard-page.html',
  styleUrl: './employee-dashboard-page.css'
})
export class EmployeeDashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly currentEmployeeId = computed(() => this.authService.currentUser()?.employeeId ?? '');

  protected readonly upcomingBookings$ = toObservable(this.currentEmployeeId).pipe(
    switchMap((employeeId) => {
      if (!employeeId) {
        return of([]);
      }

      return this.employeeBookingsService.getBookingsByEmployeeId(employeeId);
    })
  );
}
