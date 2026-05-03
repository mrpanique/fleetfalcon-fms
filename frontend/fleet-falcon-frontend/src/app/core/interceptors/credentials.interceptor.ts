import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that:
 * 1. Adds credentials (withCredentials: true) to all outgoing requests.
 *    This ensures that session/HttpOnly cookies from the Spring Boot backend are sent with each request.
 * 2. Handles 401 Unauthorized responses by clearing auth state and redirecting to /login.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Clone the request and set withCredentials to true
  const credentialReq = req.clone({
    withCredentials: true
  });

  return next(credentialReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - session expired or invalid
      if (error.status === 401) {
        // Clear auth state
        authService.logout();
        // Redirect to login page
        router.navigate(['/login']);
      }
      // Re-throw the error for other handlers
      return throwError(() => error);
    })
  );
};
