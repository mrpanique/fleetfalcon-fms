package hu.panique.fleetfalcon.repository;

import hu.panique.fleetfalcon.model.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long>{
}
