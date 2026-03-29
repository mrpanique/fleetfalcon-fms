export type EmployeeRole = 'EMPLOYEE' | 'ADMIN';

export interface BookingOwner {
  name: string;
  role: EmployeeRole;
  employeeId: string;
  department: string;
  phoneNumber: string;
  drivingLicenseNumber: string;
}
