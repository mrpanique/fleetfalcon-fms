package hu.panique.fleetfalcon.controller;

import hu.panique.fleetfalcon.dto.AuthRequest;
import hu.panique.fleetfalcon.dto.AuthResponse;
import hu.panique.fleetfalcon.dto.UserRegisterRequest;
import hu.panique.fleetfalcon.model.User;
import hu.panique.fleetfalcon.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UserService userService;

	public AuthController(AuthenticationManager authenticationManager, UserService userService) {
		this.authenticationManager = authenticationManager;
		this.userService = userService;
	}

//	@PostMapping("/register")
//	public ResponseEntity<AuthResponse> register(@RequestBody UserRegisterRequest request) {
//		if (request.getEmail() == null || request.getEmail().isBlank()) {
//			return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required"));
//		}
//		if (request.getPassword() == null || request.getPassword().isBlank()) {
//			return ResponseEntity.badRequest().body(new AuthResponse(false, "Password is required"));
//		}
//
//		try {
//			User newUser = new User();
//			newUser.setEmail(request.getEmail());
//			newUser.setPasswordHash(request.getPassword());
//			newUser.setRole(User.UserRole.EMPLOYEE);
//
//			userService.createUser(newUser);
//
//			return ResponseEntity.status(HttpStatus.CREATED)
//				.body(new AuthResponse(true, "User registered successfully"));
//		} catch (RuntimeException e) {
//			return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
//		}
//	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
		if (request.getEmail() == null || request.getPassword() == null) {
			return ResponseEntity.badRequest().body(new AuthResponse(false, "Email and password are required"));
		}

		try {
			Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
			);

			SecurityContextHolder.getContext().setAuthentication(authentication);

			return ResponseEntity.ok(new AuthResponse(true, "Login successful"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new AuthResponse(false, "Invalid email or password"));
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<AuthResponse> logout() {
		SecurityContextHolder.clearContext();
		return ResponseEntity.ok(new AuthResponse(true, "Logout successful"));
	}

	@GetMapping("/me")
	public ResponseEntity<User> getCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		String email = auth.getName();
		try {
			User user = userService.getUserByEmail(email);
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PostMapping("/register-admin")
	public ResponseEntity<AuthResponse> registerAdmin() {
		try {
			User adminUser = new User();
			adminUser.setEmail("admin@admin.com");
			adminUser.setPasswordHash("admin");
			adminUser.setRole(User.UserRole.ADMIN);

			userService.createUser(adminUser);

			return ResponseEntity.status(HttpStatus.CREATED)
				.body(new AuthResponse(true, "Default admin user created successfully"));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
		}
	}
}

