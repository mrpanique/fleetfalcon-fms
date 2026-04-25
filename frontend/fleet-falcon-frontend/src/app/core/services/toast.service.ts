import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error';

export interface ToastMessage {
  text: string;
  variant: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  protected readonly _toast = signal<ToastMessage | null>(null);

  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly toast = this._toast.asReadonly();

  success(text: string, durationMs = 2800): void {
    this.show({ text, variant: 'success' }, durationMs);
  }

  error(text: string, durationMs = 3200): void {
    this.show({ text, variant: 'error' }, durationMs);
  }

  dismiss(): void {
    this._toast.set(null);
    this.clearHideTimer();
  }

  private show(message: ToastMessage, durationMs: number): void {
    this.clearHideTimer();
    this._toast.set(message);
    this.hideTimeoutId = setTimeout(() => {
      this._toast.set(null);
      this.hideTimeoutId = null;
    }, durationMs);
  }

  private clearHideTimer(): void {
    if (this.hideTimeoutId != null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
}
