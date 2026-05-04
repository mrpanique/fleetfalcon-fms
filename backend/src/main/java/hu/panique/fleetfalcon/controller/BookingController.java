package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.dto.BookingRequest;
import hu.panique.fleetfalcon.dto.BookingStatusUpdateRequest;
import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.service.BookingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService){
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Booking> getBookings(
            @RequestParam(required = false) Booking.BookingStatus status,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) String employeeId
    ) {
        return bookingService.getBookings(status, employeeName, employeeId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Booking createBooking(@RequestBody BookingRequest bookingRequest) {
        return bookingService.createBooking(bookingRequest);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking approveBooking(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking rejectBooking(@PathVariable Long id) {
        return bookingService.rejectBooking(id);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking startRental(@PathVariable Long id, @RequestParam Integer mileage) {
        return bookingService.startRental(id, mileage);
    }

    @PostMapping("/{id}/end")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking endRental(@PathVariable Long id, @RequestParam Integer mileage) {
        return bookingService.endRental(id, mileage);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking updateBookingStatus(@PathVariable Long id, @RequestBody BookingStatusUpdateRequest request) {
        return bookingService.updateBookingStatus(id, request.getStatus());
    }
}