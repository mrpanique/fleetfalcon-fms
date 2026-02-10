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

	// adds a mock record to Vehicles table
//	@Bean
//	public CommandLineRunner demo(VehicleRepository repo) {
//		return (args) -> {
//			// Létrehozunk egy teszt autót
//			Vehicle v = new Vehicle();
//			v.setBrand("Ineos");
//			v.setModel("Grenadier");
//			v.setLicensePlate("vlxivnh48cj");
//			v.setVehicleType("CAR");
//			v.setReleaseYear(2022);
//			v.setDailyPrice(40000);
//			v.setAvailable(true);
//
//			repo.save(v);
//
//			System.out.println("--- SIKER: Az első jármű elmentve az adatbázisba! ---");
//		};
//	}

}
