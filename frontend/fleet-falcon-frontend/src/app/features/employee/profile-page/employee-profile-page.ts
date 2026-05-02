import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-employee-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-profile-page.html',
  styleUrl: './employee-profile-page.css'
})
export class EmployeeProfilePageComponent {
  private readonly toastService = inject(ToastService);

  protected oldPassword = '';
  protected newPassword = '';
  protected newPasswordConfirm = '';

  protected logout(): void {
    alert('Logout is not implemented in this demo.');
  }

  protected changePassword(): void {
    const oldPassword = this.oldPassword.trim();
    const newPassword = this.newPassword.trim();
    const newPasswordConfirm = this.newPasswordConfirm.trim();

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      this.toastService.error('Please fill in all required fields.');
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

    alert('Password change is not implemented in this demo.');
  }
}
