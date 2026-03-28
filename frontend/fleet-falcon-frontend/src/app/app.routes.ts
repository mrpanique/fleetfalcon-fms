import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page/login-page';
import { EmployeeDashboardPageComponent } from './features/employee/dashboard-page/employee-dashboard-page';
import { PagePlaceholderComponent } from './features/shell/page-placeholder/page-placeholder';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'how-it-works', component: PagePlaceholderComponent, data: { title: 'How it works' } },
	{ path: 'dashboard', component: EmployeeDashboardPageComponent },
	{ path: 'vehicles', component: PagePlaceholderComponent, data: { title: 'Vehicles' } },
	{ path: 'my-bookings', component: PagePlaceholderComponent, data: { title: 'My bookings' } },
	{ path: 'my-bookings/:id', component: PagePlaceholderComponent, data: { title: 'Booking details' } },
	{ path: 'profile', component: PagePlaceholderComponent, data: { title: 'Profile' } },
	{ path: 'admin/dashboard', component: PagePlaceholderComponent, data: { title: 'Admin dashboard' } },
	{ path: 'admin/vehicles', component: PagePlaceholderComponent, data: { title: 'Admin vehicles' } },
	{ path: 'admin/bookings', component: PagePlaceholderComponent, data: { title: 'Admin bookings' } },
	{ path: 'admin/employees', component: PagePlaceholderComponent, data: { title: 'Admin employees' } },
	{ path: 'admin/profile', component: PagePlaceholderComponent, data: { title: 'Admin profile' } },
	{ path: '**', redirectTo: 'login' }
];
