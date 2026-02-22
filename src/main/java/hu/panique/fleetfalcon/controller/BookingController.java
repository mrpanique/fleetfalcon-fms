package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.dto.BookingRequest;
import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.BookingRepository;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;

    // Dependency Injection
    public BookingController(BookingRepository bookingRepository, VehicleRepository vehicleRepository, EmployeeRepository employeeRepository){
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // CREATING the booking
    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest bookingRequest) {

        Vehicle vehicle = vehicleRepository.findById(bookingRequest.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + bookingRequest.getVehicleId()));

        Employee employee = employeeRepository.findById(bookingRequest.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + bookingRequest.getEmployeeId()));

        // Conflict detection
        boolean conflict = bookingRepository.hasConflict(bookingRequest.getVehicleId(), bookingRequest.getStartDate(), bookingRequest.getEndDate()
        );
        if (conflict) {
            throw new RuntimeException("Conflict! This vehicle is already booked for the selected dates.");
        }


        Booking booking = new Booking();
        booking.setVehicle(vehicle);
        booking.setEmployee(employee);
        booking.setStartDate(bookingRequest.getStartDate());
        booking.setEndDate(bookingRequest.getEndDate());

        // DEFAULT
        booking.setStatus("PENDING");
        System.out.println("-booking made-");

        return bookingRepository.save(booking);
    }

    // APPROVAL
    @PostMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be approved. Current status: " + booking.getStatus());
        }

        booking.setStatus("APPROVED");

        System.out.println("-booking approved-");
        return bookingRepository.save(booking);
    }

    // REJECTION
    @PostMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be rejected. Current status: " + booking.getStatus());
        }

        booking.setStatus("REJECTED");
        System.out.println("-booking rejected-");
        return bookingRepository.save(booking);
    }

    // CANCELLATION
    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!("PENDING".equals(booking.getStatus()) || "APPROVED".equals(booking.getStatus()))) {
            throw new RuntimeException("Only PENDING or APPROVED bookings can be cancelled. Current status: " + booking.getStatus());
        }

        booking.setStatus("CANCELLED");
        System.out.println("-booking cancelled-");
        return bookingRepository.save(booking);
    }

    // CHECK-OUT
    @PostMapping("/{id}/start")
    public Booking startRental(@PathVariable Long id, @RequestParam Integer mileage) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking cannot be started. Current status: " + booking.getStatus());
        }

        booking.setStartMileage(mileage);
        booking.setStatus("ACTIVE");

        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(false);

        System.out.println("-booking checked out-");
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }

    // CHECK-IN
    @PostMapping("/{id}/end")
    public Booking endRental(@PathVariable Long id, @RequestParam Integer mileage) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"ACTIVE".equals(booking.getStatus())) {
            throw new RuntimeException("Cannot end rental. Current status is: " + booking.getStatus());
        }

        if (mileage < booking.getStartMileage()) {
            throw new RuntimeException("End mileage (" + mileage + ") cannot be less than start mileage (" + booking.getStartMileage() + ")!");
        }

        booking.setEndMileage(mileage);

        double distance = (mileage - booking.getStartMileage());
        booking.setDistanceTraveled(distance);

        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(true);

        booking.setStatus("COMPLETED");

        System.out.println("-booking completed-");
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }
}