export type AdminBookingStatus = 'pending' | 'approved' | 'active' | 'completed' | 'rejected' | 'cancelled';

export interface AdminBookingListItem {
  id: string;
  detailsRoute: string;
  ariaLabel: string;
  employeeName: string;
  employeeId: string;
  vehicleName: string;
  dateRange: string;
  status: AdminBookingStatus;
  highlightPending?: boolean;
}
