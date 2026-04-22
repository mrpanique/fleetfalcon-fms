package hu.panique.fleetfalcon.repository;

import hu.panique.fleetfalcon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

}
