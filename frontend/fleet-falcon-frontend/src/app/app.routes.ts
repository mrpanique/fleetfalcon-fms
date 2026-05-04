import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page/login-page';
import { NotFoundPageComponent } from './features/common/not-found-page/not-found-page';
import { HowItWorksPageComponent } from './features/common/how-it-works-page/how-it-works-page';
import { UnauthorizedPageComponent } from './features/common/unauthorized-page/unauthorized-page';
import { AdminBookingsPageComponent } from './features/admin/bookings-page/admin-bookings-page';
import { AdminVehicleCreatePageComponent } from './features/admin/vehicle-create-page/admin-vehicle-create-page';
import { AdminDashboardPageComponent } from './features/admin/dashboard-page/admin-dashboard-page';
import { AdminEmployeeCreatePageComponent } from './features/admin/employee-create-page/admin-employee-create-page';
import { AdminEmployeesPageComponent } from './features/admin/employees-page/admin-employees-page';
import { AdminEmployeeEditPageComponent } from './features/admin/employee-edit-page/admin-employee-edit-page';
import { AdminVehicleEditPageComponent } from './features/admin/vehicle-edit-page/admin-vehicle-edit-page';
import { AdminVehicleServiceLogPageComponent } from './features/admin/vehicle-service-log-page/admin-vehicle-service-log-page';
import { AdminVehicleServiceRecordCreatePageComponent } from './features/admin/vehicle-service-record-create-page/admin-vehicle-service-record-create-page';
import { AdminVehicleServiceRecordEditPageComponent } from './features/admin/vehicle-service-record-edit-page/admin-vehicle-service-record-edit-page';
import { EmployeeDashboardPageComponent } from './features/employee/dashboard-page/employee-dashboard-page';
import { EmployeeBookingDetailsPageComponent } from './features/employee/booking-details-page/employee-booking-details-page';
import { EmployeeCreateBookingPageComponent } from './features/employee/create-booking-page/employee-create-booking-page';
import { EmployeeMyBookingsPageComponent } from './features/employee/my-bookings-page/employee-my-bookings-page';
import { EmployeeProfilePageComponent } from './features/employee/profile-page/employee-profile-page';
import { EmployeeVehicleDetailsPageComponent } from './features/employee/vehicle-details-page/employee-vehicle-details-page';
import { EmployeeVehiclesPageComponent } from './features/employee/vehicles-page/employee-vehicles-page';
import { PagePlaceholderComponent } from './features/shell/page-placeholder/page-placeholder';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent, canActivate: [loginGuard] },
	{ path: 'unauthorized', component: UnauthorizedPageComponent },
	{ path: '404', component: NotFoundPageComponent },
	{ path: 'how-it-works', component: HowItWorksPageComponent, canActivate: [authGuard] },
	{ path: 'dashboard', component: EmployeeDashboardPageComponent, canActivate: [authGuard] },
	{ path: 'vehicles', component: EmployeeVehiclesPageComponent, canActivate: [authGuard] },
	{ path: 'vehicles/:id', component: EmployeeVehicleDetailsPageComponent, canActivate: [authGuard] },
	{ path: 'my-bookings', component: EmployeeMyBookingsPageComponent, canActivate: [authGuard] },
	{ path: 'my-bookings/create', component: EmployeeCreateBookingPageComponent, canActivate: [authGuard] },
	{ path: 'my-bookings/:id', component: EmployeeBookingDetailsPageComponent, canActivate: [authGuard] },
	{ path: 'profile', component: EmployeeProfilePageComponent, canActivate: [authGuard] },
	{ path: 'admin/dashboard', component: AdminDashboardPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles', component: EmployeeVehiclesPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/new', component: AdminVehicleCreatePageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/:id/service-log', component: AdminVehicleServiceLogPageComponent, data: { title: 'Vehicle service log' }, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/:id/service-log/new', component: AdminVehicleServiceRecordCreatePageComponent, data: { title: 'Add service record' }, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/:id/service-log/:recordId/edit', component: AdminVehicleServiceRecordEditPageComponent, data: { title: 'Edit service record' }, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/:id/edit', component: AdminVehicleEditPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/vehicles/:id', component: EmployeeVehicleDetailsPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/my-bookings/create', component: EmployeeCreateBookingPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/my-bookings/:id', component: EmployeeBookingDetailsPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/bookings', component: AdminBookingsPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/bookings/:id', component: EmployeeBookingDetailsPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/employees', component: AdminEmployeesPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/employees/new', component: AdminEmployeeCreatePageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/employees/:id/edit', component: AdminEmployeeEditPageComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/profile', component: EmployeeProfilePageComponent, canActivate: [authGuard, adminGuard] },
	{ path: '**', redirectTo: '404' }
];
