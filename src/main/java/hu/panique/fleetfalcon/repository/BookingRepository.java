package hu.panique.fleetfalcon.repository;

import hu.panique.fleetfalcon.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Extra querys can come here later eg.:
    // List<Booking> findByStatus(String status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.vehicle.id = :vehicleId AND b.status NOT IN ('CANCELLED', 'REJECTED') AND (b.startDate < :endDate AND b.endDate > :startDate)")
    boolean hasConflict(@Param("vehicleId") Long vehicleId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);



}