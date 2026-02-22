package hu.panique.fleetfalcon.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long vehicleId;
    private Long employeeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}