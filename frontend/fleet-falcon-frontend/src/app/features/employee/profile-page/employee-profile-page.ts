import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-profile-page.html',
  styleUrl: './employee-profile-page.css'
})
export class EmployeeProfilePageComponent {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  protected oldPassword = '';
  protected newPassword = '';
  protected newPasswordConfirm = '';
  protected showValidationErrors = false;

  // Expose currentUser from auth service
  protected currentUser = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Logged out successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastService.error('Logout failed: ' + (err?.error?.message || 'Unknown error'));
      }
    });
  }

  protected changePassword(): void {
    this.showValidationErrors = true;

    const oldPassword = this.oldPassword.trim();
    const newPassword = this.newPassword.trim();
    const newPasswordConfirm = this.newPasswordConfirm.trim();

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    if (!this.isPasswordValid()) {
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      this.toastService.error('The new passwords do not match.');
      return;
    }

    if (oldPassword === newPassword) {
      this.toastService.error('The new password must be different from the old password.');
      return;
    }

    const currentUser = this.currentUser();
    if (!currentUser) {
      this.toastService.error('User not found');
      return;
    }

    this.authService.updatePassword(currentUser.id, oldPassword, newPassword).subscribe({
      next: () => {
        this.toastService.success('Password changed successfully');
        this.oldPassword = '';
        this.newPassword = '';
        this.newPasswordConfirm = '';
      },
      error: (err) => {
        this.toastService.error('Password change failed: ' + (err?.error?.message || 'Unknown error'));
      }
    });
  }

  protected getNewPasswordError(): string {
    if (!this.showValidationErrors) {
      return '';
    }

    return this.isPasswordValid() ? '' : 'Min. 8 characters, Min. 1 uppercase letter, Min. 1 number';
  }

  private isPasswordValid(): boolean {
    return this.passwordPattern.test(this.newPassword);
  }
}
