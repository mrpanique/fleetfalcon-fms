import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-create-booking-page',
  imports: [RouterLink],
  templateUrl: './employee-create-booking-page.html',
  styleUrl: './employee-create-booking-page.css'
})
export class EmployeeCreateBookingPageComponent {
  protected readonly dailyPrice = 18000;
  protected readonly startDate = signal('');
  protected readonly endDate = signal('');

  protected readonly dayCount = computed(() => {
    const start = this.startDate();
    const end = this.endDate();

    if (!start || !end) {
      return 0;
    }

    const startAt = new Date(start);
    const endAt = new Date(end);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
      return 0;
    }

    const diffMs = endAt.getTime() - startAt.getTime();
    const dayMs = 1000 * 60 * 60 * 24;

    return Math.max(1, Math.ceil(diffMs / dayMs));
  });

  protected readonly estimatedCost = computed(() => this.dayCount() * this.dailyPrice);

  protected onStartDateInput(value: string): void {
    this.startDate.set(value);
  }

  protected onEndDateInput(value: string): void {
    this.endDate.set(value);
  }
}
