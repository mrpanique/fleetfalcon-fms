package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.dto.BookingRequest;
import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.BookingRepository;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Booking createBooking(BookingRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + request.getEmployeeId()));

        boolean conflict = bookingRepository.hasConflict(request.getVehicleId(), request.getStartDate(), request.getEndDate());
        if (conflict) {
            throw new RuntimeException("Conflict! This vehicle is already booked for the selected dates.");
        }

        Booking booking = new Booking();
        booking.setVehicle(vehicle);
        booking.setEmployee(employee);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be approved.");
        }
        booking.setStatus("APPROVED");
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be rejected.");
        }
        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!("PENDING".equals(booking.getStatus()) || "APPROVED".equals(booking.getStatus()))) {
            throw new RuntimeException("Only PENDING or APPROVED bookings can be cancelled.");
        }
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public Booking startRental(Long id, Integer mileage) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking cannot be started. Must be APPROVED.");
        }

        booking.setStartMileage(mileage);
        booking.setStatus("ACTIVE");

        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    public Booking endRental(Long id, Integer mileage) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!"ACTIVE".equals(booking.getStatus())) {
            throw new RuntimeException("Cannot end rental. Current status is: " + booking.getStatus());
        }
        if (mileage < booking.getStartMileage()) {
            throw new RuntimeException("End mileage cannot be less than start mileage!");
        }

        booking.setEndMileage(mileage);
        booking.setDistanceTraveled((double) (mileage - booking.getStartMileage()));
        booking.setStatus("COMPLETED");

        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }
}