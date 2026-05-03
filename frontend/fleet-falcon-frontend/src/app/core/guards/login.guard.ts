import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * LoginGuard: Prevents already-authenticated users from accessing the login page.
 * If a logged-in user tries to navigate to /login, they are redirected to /dashboard.
 */
@Injectable({ providedIn: 'root' })
export class LoginGuardService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate: CanActivateFn = () => {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect already logged-in users to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  };
}

export const loginGuard: CanActivateFn = (route, state) => {
  const guardService = inject(LoginGuardService);
  return guardService.canActivate(route, state);
};
