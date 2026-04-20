package hu.panique.fleetfalcon.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(unique = true, nullable = false)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    private Integer releaseYear;

    private Integer dailyPrice;

    private Integer seatingCapacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    private Integer currentMileage;

    private LocalDate inspectionValidUntil;

    private Integer nextServiceMileage;

    private LocalDate nextServiceDate;

    public enum VehicleType {
        CAR,
        MINIVAN,
        VAN,
        BUS,
        MOTORCYCLE,
        TRUCK,
        OTHER
    }

    public enum FuelType {
        PETROL,
        DIESEL,
        ELECTRIC,
        HYBRID,
        OTHER
    }

    public enum VehicleStatus {
        AVAILABLE,
        IN_USE,
        MAINTENANCE,
        OUT_OF_SERVICE
    }
}