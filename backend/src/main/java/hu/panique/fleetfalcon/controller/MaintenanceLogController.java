package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.model.MaintenanceLog;
import hu.panique.fleetfalcon.service.MaintenanceLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-logs")
public class MaintenanceLogController {

	private final MaintenanceLogService maintenanceLogService;

	public MaintenanceLogController(MaintenanceLogService maintenanceLogService) {
		this.maintenanceLogService = maintenanceLogService;
	}

	@GetMapping
	public List<MaintenanceLog> getAllMaintenanceLogs() {
		return maintenanceLogService.getAllMaintenanceLogs();
	}

	@PostMapping
	public MaintenanceLog createMaintenanceLog(@RequestBody MaintenanceLog maintenanceLog) {
		return maintenanceLogService.createMaintenanceLog(maintenanceLog);
	}

	@GetMapping("/{id}")
	public MaintenanceLog getMaintenanceLogById(@PathVariable Long id) {
		return maintenanceLogService.getMaintenanceLogById(id);
	}

	@PutMapping("/{id}")
	public MaintenanceLog updateMaintenanceLog(@PathVariable Long id, @RequestBody MaintenanceLog maintenanceLogDetails) {
		return maintenanceLogService.updateMaintenanceLog(id, maintenanceLogDetails);
	}
}
