package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.dto.BookingRequest;
import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.BookingRepository;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;

    public BookingService(BookingRepository bookingRepository, VehicleRepository vehicleRepository, EmployeeRepository employeeRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookings(Booking.BookingStatus status, String employeeName, String employeeId) {
        Specification<Booking> spec = (root, query, cb) -> cb.conjunction();

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (hasText(employeeName)) {
            spec = spec.and((root, query, cb) -> buildNameFilter(cb, root, employeeName));
        }
        if (hasText(employeeId)) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("employee").get("employeeId"), employeeId));
        }

        return bookingRepository.findAll(spec);
    }

    private Predicate buildNameFilter(
            CriteriaBuilder cb,
            Root<Booking> root,
            String employeeName) {
        String[] parts = employeeName.trim().toLowerCase().split("\\s+");
        
        if (parts.length == 1) {
            // Single word: search in both firstName and lastName
            String filter = "%" + parts[0] + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("employee").get("firstName")), filter),
                    cb.like(cb.lower(root.get("employee").get("lastName")), filter)
            );
        }

        // Multi-word: match only the ordered full name "firstName lastName".
        String fullNameFilter = "%" + employeeName.trim().toLowerCase() + "%";
        return cb.like(
                cb.lower(
                        cb.concat(
                                cb.concat(root.get("employee").get("firstName"), cb.literal(" ")),
                                root.get("employee").get("lastName")
                        )
                ),
                fullNameFilter
        );
    }

    public Booking createBooking(BookingRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + request.getEmployeeId()));

        boolean conflict = bookingRepository.hasConflict(
                request.getVehicleId(),
                request.getStartDate(),
                request.getEndDate(),
                Booking.BookingStatus.CANCELLED,
                Booking.BookingStatus.REJECTED
        );
        if (conflict) {
            throw new RuntimeException("Conflict! This vehicle is already booked for the selected dates.");
        }

        Booking booking = new Booking();
        booking.setVehicle(vehicle);
        booking.setEmployee(employee);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setStatus(Booking.BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be approved.");
        }
        booking.setStatus(Booking.BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be rejected.");
        }
        booking.setStatus(Booking.BookingStatus.REJECTED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!(booking.getStatus() == Booking.BookingStatus.PENDING || booking.getStatus() == Booking.BookingStatus.APPROVED)) {
            throw new RuntimeException("Only PENDING or APPROVED bookings can be cancelled.");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public Booking startRental(Long id, Integer mileage) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != Booking.BookingStatus.APPROVED) {
            throw new RuntimeException("Booking cannot be started. Must be APPROVED.");
        }

        booking.setStartMileage(mileage);
        booking.setStatus(Booking.BookingStatus.ACTIVE);

        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(Vehicle.VehicleStatus.IN_USE);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    public Booking endRental(Long id, Integer mileage) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != Booking.BookingStatus.ACTIVE) {
            throw new RuntimeException("Cannot end rental. Current status is: " + booking.getStatus());
        }
        if (mileage < booking.getStartMileage()) {
            throw new RuntimeException("End mileage cannot be less than start mileage!");
        }

        booking.setEndMileage(mileage);
        booking.setDistanceTraveled(mileage - booking.getStartMileage());
        booking.setStatus(Booking.BookingStatus.COMPLETED);

        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicle.setCurrentMileage(mileage);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}