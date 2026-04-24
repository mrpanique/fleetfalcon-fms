package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getVehicles(
            String brand,
            String model,
            Vehicle.VehicleType vehicleType,
            Vehicle.FuelType fuelType,
            Integer dailyPrice,
            Integer seatingCapacity,
            Vehicle.VehicleStatus status,
            LocalDateTime availableFrom,
            LocalDateTime availableTo
    ) {
        validateAvailabilityWindow(availableFrom, availableTo);

        Specification<Vehicle> spec = (root, query, cb) -> cb.conjunction();

        if (hasText(brand)) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("brand")), "%" + brand.toLowerCase() + "%"));
        }
        if (hasText(model)) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%"));
        }
        if (vehicleType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("vehicleType"), vehicleType));
        }
        if (fuelType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("fuelType"), fuelType));
        }
        if (dailyPrice != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("dailyPrice"), dailyPrice));
        }
        if (seatingCapacity != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("seatingCapacity"), seatingCapacity));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (availableFrom != null && availableTo != null) {
            spec = spec.and((root, query, cb) -> {
                var subquery = query.subquery(Long.class);
                var bookingRoot = subquery.from(Booking.class);

                subquery.select(bookingRoot.get("id"));
                subquery.where(
                        cb.and(
                                cb.equal(bookingRoot.get("vehicle"), root),
                                bookingRoot.get("status").in(
                                        Booking.BookingStatus.PENDING,
                                        Booking.BookingStatus.APPROVED,
                                        Booking.BookingStatus.ACTIVE
                                ),
                                cb.lessThan(bookingRoot.get("startDate"), availableTo),
                                cb.greaterThan(bookingRoot.get("endDate"), availableFrom)
                        )
                );

                return cb.not(cb.exists(subquery));
            });
        }

        return vehicleRepository.findAll(spec);
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
        vehicle.setVehicleType(vehicleDetails.getVehicleType());
        vehicle.setFuelType(vehicleDetails.getFuelType());
        vehicle.setReleaseYear(vehicleDetails.getReleaseYear());
        vehicle.setDailyPrice(vehicleDetails.getDailyPrice());
        vehicle.setSeatingCapacity(vehicleDetails.getSeatingCapacity());
        vehicle.setDescription(vehicleDetails.getDescription());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setCurrentMileage(vehicleDetails.getCurrentMileage());
        vehicle.setInspectionValidUntil(vehicleDetails.getInspectionValidUntil());
        vehicle.setNextServiceMileage(vehicleDetails.getNextServiceMileage());
        vehicle.setNextServiceDate(vehicleDetails.getNextServiceDate());

        return vehicleRepository.save(vehicle);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void validateAvailabilityWindow(LocalDateTime availableFrom, LocalDateTime availableTo) {
        if ((availableFrom == null) != (availableTo == null)) {
            throw new RuntimeException("Both availableFrom and availableTo must be provided together.");
        }
        if (availableFrom != null && !availableFrom.isBefore(availableTo)) {
            throw new RuntimeException("availableFrom must be before availableTo.");
        }
    }
}