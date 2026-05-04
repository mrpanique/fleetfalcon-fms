import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard: Protects routes by ensuring the user is authenticated.
 * If the user is not authenticated, they are redirected to /login.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate: CanActivateFn = () => {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect unauthenticated users to login
    this.router.navigate(['/login']);
    return false;
  };
}

export const authGuard: CanActivateFn = (route, state) => {
  const guardService = inject(AuthGuardService);
  return guardService.canActivate(route, state);
};
