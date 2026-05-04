import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { BookingListComponent } from '../components/booking-list/booking-list';
import { EmployeeBookingsService } from '../services/employee-bookings.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-my-bookings-page',
  imports: [BookingListComponent, AsyncPipe],
  templateUrl: './employee-my-bookings-page.html',
  styleUrl: './employee-my-bookings-page.css'
})
export class EmployeeMyBookingsPageComponent {
  private readonly authService = inject(AuthService);
  private readonly employeeBookingsService = inject(EmployeeBookingsService);

  protected readonly currentEmployeeId = computed(() => this.authService.currentUser()?.employeeId ?? '');

  protected readonly bookings$ = toObservable(this.currentEmployeeId).pipe(
    switchMap((employeeId) => {
      if (!employeeId) {
        return of([]);
      }

      return this.employeeBookingsService.getBookingsByEmployeeId(employeeId);
    })
  );
}
