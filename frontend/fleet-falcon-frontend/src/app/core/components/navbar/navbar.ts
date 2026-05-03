import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type UserRole = 'EMPLOYEE' | 'ADMIN';

type NavItem = {
  label: string;
  route: string;
};

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);

  protected readonly mobileMenuOpen = signal(false);

  protected readonly employeeNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Book a vehicle', route: '/vehicles' },
    { label: 'My bookings', route: '/my-bookings' },
    { label: 'Info', route: '/how-it-works' },
    { label: 'Profile', route: '/profile' }
  ];

  protected readonly adminNavItems: NavItem[] = [
    { label: 'Admin dashboard', route: '/admin/dashboard' },
    { label: 'Vehicles', route: '/admin/vehicles' },
    { label: 'Bookings', route: '/admin/bookings' },
    { label: 'Employees', route: '/admin/employees' },
    { label: 'Info', route: '/how-it-works' },
    { label: 'Profile', route: '/admin/profile' }
  ];

  /**
   * Reactive role from AuthService
   */
  protected readonly role = computed<UserRole>(() => {
    return this.authService.isAdmin() ? 'ADMIN' : 'EMPLOYEE';
  });

  protected readonly navItems = computed(() =>
    this.role() === 'ADMIN' ? this.adminNavItems : this.employeeNavItems
  );

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
