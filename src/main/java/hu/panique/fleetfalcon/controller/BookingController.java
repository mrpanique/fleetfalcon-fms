package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.dto.BookingRequest;
import hu.panique.fleetfalcon.model.Booking;
import hu.panique.fleetfalcon.service.BookingService;
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
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest bookingRequest) {
        return bookingService.createBooking(bookingRequest);
    }

    @PostMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PostMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Long id) {
        return bookingService.rejectBooking(id);
    }

    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @PostMapping("/{id}/start")
    public Booking startRental(@PathVariable Long id, @RequestParam Integer mileage) {
        return bookingService.startRental(id, mileage);
    }

    @PostMapping("/{id}/end")
    public Booking endRental(@PathVariable Long id, @RequestParam Integer mileage) {
        return bookingService.endRental(id, mileage);
    }
}