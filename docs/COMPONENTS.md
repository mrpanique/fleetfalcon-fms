# FleetFalcon komponensek

## 1. Komponensfa (page-szintű)

```text
App
├── Core
│   ├── AppShell
│   │   ├── Navbar
│   │   ├── RoleMenu
│   │   └── NotificationArea
│   ├── AuthGuard
│   ├── RoleGuard
│   └── Shared
│       ├── SearchBar
│       ├── FilterPanel
│       ├── Pagination
│       ├── StatusBadge
│       ├── ConfirmDialog
│       └── EmptyState
├── Public
│   ├── LoginPage
│   ├── HowItWorksPage
│   ├── UnauthorizedPage
│   └── NotFoundPage
├── Employee
│   ├── EmployeeDashboardPage
│   ├── VehiclesModule
│   │   ├── VehicleListPage
│   │   └── VehicleDetailPage
│   ├── MyBookingsModule
│   │   ├── MyBookingsPage
│   │   ├── BookingCreatePage
│   │   ├── BookingDetailPage
│   └── EmployeeProfilePage
├── Admin
│   ├── AdminDashboardPage
│   ├── AdminVehiclesModule
│   │   ├── AdminVehicleListPage
│   │   ├── AdminVehicleCreatePage
│   │   ├── AdminVehicleDetailPage
│   │   ├── AdminVehicleEditPage
│   │   └── VehicleMaintenancePage
│   ├── AdminBookingsModule
│   │   ├── AdminBookingListPage
│   │   └── AdminBookingDetailPage
│   ├── AdminEmployeesModule
│   │   ├── AdminEmployeeListPage
│   │   ├── AdminEmployeeCreatePage
│   │   ├── AdminEmployeeDetailPage
│   │   └── AdminEmployeeEditPage
│   └── AdminProfilePage
└── DataAccess
    ├── AuthApiService
    ├── VehicleApiService
    ├── BookingApiService
    ├── EmployeeApiService
    └── MaintenanceApiService
```

## 2. Modulok/oldalak és komponensek

| Modul/oldal | Útvonal | Fő komponensek |
|---|---|---|
| Publikus bejelentkezés | `/login` | `LoginPage`, `AuthForm` |
| Közös információ | `/how-it-works` | `HowItWorksPage` |
| Jogosultsági hiba | `/unauthorized` | `UnauthorizedPage` |
| Nem található oldal | `/404` | `NotFoundPage` |
| Alkalmazotti kezdőlap | `/dashboard` | `EmployeeDashboardPage`, `BookCarButton`, `UpcomingBookingsWidget`, `InfoPageButton` |
| Jármű lista | `/vehicles` | `VehicleListPage`, `SearchBar`, `FilterPanel` |
| Jármű részletek | `/vehicles/{id}` | `VehicleDetailPage`, `StatusBadge` |
| Saját foglalások lista | `/my-bookings` | `MyBookingsPage`, `SpendingSummary` |
| Új foglalás | `/my-bookings/create` | `BookingCreatePage` |
| Foglalás részletek | `/my-bookings/{id}` | `BookingDetailPage` |
| Foglalás szerkesztés | `/my-bookings/{id}/edit` | `BookingEditPage` |
| Alkalmazotti profil | `/profile` | `EmployeeProfilePage`, `SettingsForm`, `PasswordChangeForm` |
| Admin kezdőlap | `/admin/dashboard` | `AdminDashboardPage`, `FleetStatusWidget`, `RecentBookingsWidget` |
| Admin járművek lista | `/admin/vehicles` | `AdminVehicleListPage`, `SearchBar`, `FilterPanel` |
| Admin jármű létrehozás | `/admin/vehicles/create` | `AdminVehicleCreatePage`, `VehicleForm` |
| Admin jármű részletek | `/admin/vehicles/{id}` | `AdminVehicleDetailPage`, `BookingHistoryList` |
| Admin jármű szerkesztés | `/admin/vehicles/{id}/edit` | `AdminVehicleEditPage`, `VehicleForm` |
| Jármű karbantartás | `/admin/vehicles/{id}/maintenance` | `VehicleMaintenancePage`, `ServiceSettingsForm`, `MaintenanceLogList` |
| Admin foglalások lista | `/admin/bookings` | `AdminBookingListPage`, `FilterPanel` |
| Admin foglalás részletek | `/admin/bookings/{id}` | `AdminBookingDetailPage`, `BookingDecisionPanel`, `BookingTimeline` |
| Admin alkalmazottak lista | `/admin/employees` | `AdminEmployeeListPage`, `SearchBar` |
| Admin alkalmazott létrehozás | `/admin/employees/create` | `AdminEmployeeCreatePage`, `EmployeeForm` |
| Admin alkalmazott részletek | `/admin/employees/{id}` | `AdminEmployeeDetailPage`, `EmployeeDetailsCard` |
| Admin alkalmazott szerkesztés | `/admin/employees/{id}/edit` | `AdminEmployeeEditPage`, `EmployeeForm` |
| Admin profil | `/admin/profile` | `AdminProfilePage`, `SettingsForm`, `SystemSettingsForm` |

## 3. Domain-komponensek kapcsolata az adatmodellel

- `Vehicle` entitás: `VehicleListPage`, `VehicleDetailPage`, `AdminVehicleDetailPage`, `VehicleMaintenancePage`
- `Booking` entitás: `MyBookingsPage`, `BookingCreatePage`, `BookingDetailPage`, `AdminBookingDetailPage`
- `Employee` entitás: `AdminEmployeeListPage`, `AdminEmployeeDetailPage`, `EmployeeProfilePage`
- `MaintenanceLog` entitás: `VehicleMaintenancePage`, `AdminVehicleDetailPage`
- `User` entitás: `LoginPage`, `RoleGuard`, `EmployeeProfilePage`, `AdminProfilePage`


