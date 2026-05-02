import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  private readonly toastService = inject(ToastService);

  protected onSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const email = (fd.get('email') as string | null) ?? '';
    const password = (fd.get('password') as string | null) ?? '';

    if (email.trim() === '' || password.trim() === '') {
      event.preventDefault();
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    // If not empty, allow default submit behavior (existing logic may handle actual login).
  }
}
