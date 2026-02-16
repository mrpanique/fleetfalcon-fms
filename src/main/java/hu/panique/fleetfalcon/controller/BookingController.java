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

        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }
}