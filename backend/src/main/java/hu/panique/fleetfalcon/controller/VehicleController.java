package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.service.VehicleService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Vehicle> getVehicles(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Vehicle.VehicleType vehicleType,
            @RequestParam(required = false) Vehicle.FuelType fuelType,
            @RequestParam(required = false) Integer dailyPrice,
            @RequestParam(required = false) Integer seatingCapacity,
            @RequestParam(required = false) Vehicle.VehicleStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime availableFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime availableTo
    ) {
        return vehicleService.getVehicles(
                brand,
                model,
                vehicleType,
                fuelType,
                dailyPrice,
                seatingCapacity,
                status,
                availableFrom,
                availableTo
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.createVehicle(vehicle);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleService.updateVehicle(id, vehicleDetails);
    }
}