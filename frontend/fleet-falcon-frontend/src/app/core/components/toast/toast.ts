import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  protected readonly toast = this.toastService.toast;
  protected readonly toastClass = computed(() => this.toast()?.variant ?? 'success');

  protected dismiss(): void {
    this.toastService.dismiss();
  }
}
