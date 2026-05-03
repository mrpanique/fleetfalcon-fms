import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AdminGuard: Protects admin routes by ensuring the user has the ADMIN role.
 * If the user is not an admin, they are redirected to the home page (/dashboard).
 */
@Injectable({ providedIn: 'root' })
export class AdminGuardService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate: CanActivateFn = () => {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    // Redirect non-admin users to home page
    this.router.navigate(['/dashboard']);
    return false;
  };
}

export const adminGuard: CanActivateFn = (route, state) => {
  const guardService = inject(AdminGuardService);
  return guardService.canActivate(route, state);
};
