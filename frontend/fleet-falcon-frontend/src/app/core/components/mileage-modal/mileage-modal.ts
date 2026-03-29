import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mileage-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mileage-modal.html',
  styleUrl: './mileage-modal.css'
})
export class MileageModalComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) subtitle = '';
  @Input({ required: true }) fieldLabel = '';
  @Input({ required: true }) confirmLabel = '';
  @Input() mileageValue = '';

  @Output() close = new EventEmitter<void>();
  @Output() mileageValueChange = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<void>();

  protected onMileageInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.mileageValueChange.emit(target.value);
  }
}
