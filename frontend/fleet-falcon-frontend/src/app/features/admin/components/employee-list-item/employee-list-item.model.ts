export type EmployeeRole = 'EMPLOYEE' | 'ADMIN';

export interface AdminEmployeeListItem {
  id: string;
  name: string;
  role: EmployeeRole;
  employeeId: string;
  department: string;
  phoneNumber: string;
  drivingLicenseNumber: string;
}
