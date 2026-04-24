package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.MaintenanceLog;
import hu.panique.fleetfalcon.repository.MaintenanceLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceLogService {

	private final MaintenanceLogRepository maintenanceLogRepository;

	public MaintenanceLogService(MaintenanceLogRepository maintenanceLogRepository) {
		this.maintenanceLogRepository = maintenanceLogRepository;
	}

	public List<MaintenanceLog> getAllMaintenanceLogs() {
		return maintenanceLogRepository.findAll();
	}

	public MaintenanceLog createMaintenanceLog(MaintenanceLog maintenanceLog) {
		return maintenanceLogRepository.save(maintenanceLog);
	}

	public MaintenanceLog getMaintenanceLogById(Long id) {
		return maintenanceLogRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Maintenance log not found with id: " + id));
	}

	public MaintenanceLog updateMaintenanceLog(Long id, MaintenanceLog maintenanceLogDetails) {
		MaintenanceLog maintenanceLog = maintenanceLogRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Maintenance log not found with id: " + id));

		maintenanceLog.setVehicle(maintenanceLogDetails.getVehicle());
		maintenanceLog.setType(maintenanceLogDetails.getType());
		maintenanceLog.setStartDate(maintenanceLogDetails.getStartDate());
		maintenanceLog.setEndDate(maintenanceLogDetails.getEndDate());
		maintenanceLog.setCost(maintenanceLogDetails.getCost());
		maintenanceLog.setDescription(maintenanceLogDetails.getDescription());

		return maintenanceLogRepository.save(maintenanceLog);
	}
}

