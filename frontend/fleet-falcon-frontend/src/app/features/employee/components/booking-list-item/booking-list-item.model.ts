export type BookingListStatus = 'APPROVED' | 'PENDING' | 'COMPLETED';

export interface BookingListItem {
  id: string;
  detailsRoute: string;
  timeRange: string;
  vehicleName: string;
  status: BookingListStatus;
}
