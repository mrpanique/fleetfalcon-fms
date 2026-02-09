package hu.panique.fleetfalcon.repository;

import hu.panique.fleetfalcon.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // This gives: save(), findAll(), findById(), deleteById()
}