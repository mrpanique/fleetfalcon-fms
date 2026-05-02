package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.dto.PasswordUpdateRequest;
import hu.panique.fleetfalcon.model.User;
import hu.panique.fleetfalcon.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public User createUser(@RequestBody User user) {
		return userService.createUser(user);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public User getUserByID(@PathVariable Long id) {
		return userService.getUserById(id);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
	}

	@PutMapping("/{id}/password")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Void> updateUserPassword(@PathVariable Long id, @RequestBody PasswordUpdateRequest request) {
		userService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword());
		return ResponseEntity.noContent().build();
	}
}
