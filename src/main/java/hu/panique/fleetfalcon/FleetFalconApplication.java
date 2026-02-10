package hu.panique.fleetfalcon;

import hu.panique.fleetfalcon.model.Vehicle;
import hu.panique.fleetfalcon.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FleetFalconApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleetFalconApplication.class, args);
	}
}
