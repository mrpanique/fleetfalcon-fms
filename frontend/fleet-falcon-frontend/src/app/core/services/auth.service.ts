import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employeeId?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080';

  // Reactive state using Angular Signals
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Read-only signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  // BehaviorSubject for legacy observable-based access
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAdminSubject = new BehaviorSubject<boolean>(false);
  readonly isAdmin$ = this.isAdminSubject.asObservable();

  /**
   * Attempt to log in with email and password.
   * On successful login, fetches the current user details.
   */
  login(credentials: LoginRequest): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    const formBody = new URLSearchParams();
    formBody.set('email', credentials.email);
    formBody.set('password', credentials.password);

    return this.http
      .post<void>(`${this.apiBaseUrl}/api/auth/login`, formBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(
        tap({
          next: () => {
            // Login endpoint succeeded, now fetch the current user
            // This is handled by the component after successful POST
          },
          error: (err) => {
            this._isLoading.set(false);
            this._error.set(err?.error?.message || 'Login failed');
          }
        })
      );
  }

  /**
   * Fetch the current authenticated user from the backend.
   * Call this on application startup and after successful login.
   */
  fetchCurrentUser(): Observable<AuthUser> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http
      .get<AuthUser>(`${this.apiBaseUrl}/api/auth/me`)
      .pipe(
        tap({
          next: (user) => {
            this._currentUser.set(user);
            this.currentUserSubject.next(user);
            this.isAdminSubject.next(user.role === 'ADMIN');
            this._isLoading.set(false);
          },
          error: (err) => {
            this._error.set('Failed to fetch current user');
            this._isLoading.set(false);
            this._currentUser.set(null);
            this.currentUserSubject.next(null);
            this.isAdminSubject.next(false);
          }
        })
      );
  }

  /**
   * Log out the current user by calling the logout endpoint.
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/api/auth/logout`, {}).pipe(
      tap({
        next: () => {
          this._currentUser.set(null);
          this.currentUserSubject.next(null);
          this.isAdminSubject.next(false);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Logout failed');
          // Clear user state anyway on error
          this._currentUser.set(null);
          this.currentUserSubject.next(null);
          this.isAdminSubject.next(false);
        }
      })
    );
  }

  /**
   * Update the password for the current user.
   */
  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiBaseUrl}/api/users/${userId}/password`,
      {
        currentPassword,
        newPassword
      }
    );
  }
}
