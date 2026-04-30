export type BookingListStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface BookingListItem {
  id: string;
  detailsRoute: string;
  timeRange: string;
  vehicleName: string;
  status: BookingListStatus;
}
