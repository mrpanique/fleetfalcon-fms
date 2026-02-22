package hu.panique.fleetfalcon.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One booking -> One vehicle (but One vehicle -> Many booking)
    //@{this entity}To{joined entity}
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;


    // One booking -> One employee (but One employee -> Many booking)
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    // can be: PENDING (waiting for approval), APPROVED, ACTIVE ,REJECTED, COMPLETED, CANCELLED
    // Default: PENDING
    // ENUM later?
    private String status;

    private Integer startMileage;

    private Integer endMileage;

    private Double distanceTraveled;

    private Double estimatedCost;
}