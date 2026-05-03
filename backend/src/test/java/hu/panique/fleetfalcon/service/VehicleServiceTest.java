package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle testVehicle;

    @BeforeEach
    void setUp() {
        testVehicle = new Vehicle();
        testVehicle.setId(1L);
        testVehicle.setBrand("Toyota");
        testVehicle.setModel("Corolla");
        testVehicle.setVehicleType(Vehicle.VehicleType.CAR);
        testVehicle.setFuelType(Vehicle.FuelType.PETROL);
        testVehicle.setDailyPrice(50);
        testVehicle.setSeatingCapacity(5);
        testVehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
    }

    @Test
    void testGetAllVehicles_ReturnsAllVehicles() {
        List<Vehicle> vehicles = List.of(testVehicle);
        when(vehicleRepository.findAll()).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getAllVehicles();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Toyota", result.get(0).getBrand());
        verify(vehicleRepository, times(1)).findAll();
    }

    @Test
    void testGetVehicles_FilterByBrand_ReturnsFilteredVehicles() {
        List<Vehicle> vehicles = List.of(testVehicle);
        when(vehicleRepository.findAll(any())).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getVehicles("Toyota", null, null, null, null, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(vehicleRepository, times(1)).findAll(any());
    }

    @Test
    void testGetVehicles_FilterByVehicleType_ReturnsFilteredVehicles() {
        List<Vehicle> vehicles = List.of(testVehicle);
        when(vehicleRepository.findAll(any())).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getVehicles(null, null, Vehicle.VehicleType.CAR, null, null, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(Vehicle.VehicleType.CAR, result.get(0).getVehicleType());
    }

    @Test
    void testGetVehicles_FilterByDailyPrice_ReturnsFilteredVehicles() {
        List<Vehicle> vehicles = List.of(testVehicle);
        when(vehicleRepository.findAll(any())).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getVehicles(null, null, null, null, 50, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(50, result.get(0).getDailyPrice());
    }

    @Test
    void testGetVehicles_MultipleFilters_ReturnsFilteredVehicles() {
        List<Vehicle> vehicles = List.of(testVehicle);
        when(vehicleRepository.findAll(any())).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getVehicles(
                "Toyota",
                "Corolla",
                Vehicle.VehicleType.CAR,
                Vehicle.FuelType.PETROL,
                50,
                5,
                Vehicle.VehicleStatus.AVAILABLE,
                null,
                null
        );

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(vehicleRepository, times(1)).findAll(any());
    }

    @Test
    void testGetVehicles_InvalidAvailabilityWindow_ThrowsException() {
        java.time.LocalDateTime availableTo = java.time.LocalDateTime.now();
        java.time.LocalDateTime availableFrom = java.time.LocalDateTime.now().plusDays(1);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            vehicleService.getVehicles(null, null, null, null, null, null, null, availableFrom, availableTo);
        });

        assertTrue(exception.getMessage().contains("availableFrom must be before availableTo"));
    }
}
