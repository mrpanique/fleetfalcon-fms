package hu.panique.fleetfalcon.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "vehicle_id", nullable = false)
	private Vehicle vehicle;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MaintenanceType type;

	@Column(nullable = false)
	private LocalDateTime startDate;

	@Column(nullable = false)
	private LocalDateTime endDate;

	@Column(nullable = false)
	private Integer cost;

	@Column(columnDefinition = "TEXT")
	private String description;

	public enum MaintenanceType {
		ROUTINE_SERVICE,
		REPAIR,
		TIRE_CHANGE
	}
}
