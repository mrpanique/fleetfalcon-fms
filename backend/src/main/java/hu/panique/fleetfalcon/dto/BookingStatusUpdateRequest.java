package hu.panique.fleetfalcon.dto;

import hu.panique.fleetfalcon.model.Booking;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {
    private Booking.BookingStatus status;
}

