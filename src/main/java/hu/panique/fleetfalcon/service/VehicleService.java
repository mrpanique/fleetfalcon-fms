package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.stereotype.Service;

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
        vehicle.setReleaseYear(vehicleDetails.getReleaseYear());
        vehicle.setDailyPrice(vehicleDetails.getDailyPrice());
        vehicle.setAvailable(vehicleDetails.isAvailable());

        return vehicleRepository.save(vehicle);
    }
}