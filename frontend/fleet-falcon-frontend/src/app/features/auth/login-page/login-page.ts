import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly isLoading = this.authService.isLoading;

  protected onSubmit(event: Event): void {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const email = (fd.get('email') as string | null) ?? '';
    const password = (fd.get('password') as string | null) ?? '';

    if (email.trim() === '' || password.trim() === '') {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    const credentials: LoginRequest = { email: email.trim(), password };

    // Call login endpoint
    this.authService.login(credentials).subscribe({
      next: () => {
        // Login successful, now fetch the current user details
        this.authService.fetchCurrentUser().subscribe({
          next: () => {
            // User fetched successfully, redirect to dashboard
            this.toastService.success('Login successful!');
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.toastService.error('Failed to fetch user details after login.');
          }
        });
      },
      error: (err) => {
        // Login failed
        const errorMsg = err?.error?.message || 'Login failed. Please check your credentials.';
        this.toastService.error(errorMsg);
      }
    });
  }
}
