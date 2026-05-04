package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.User;
import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import hu.panique.fleetfalcon.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");

    public UserService(UserRepository userRepository, EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {

        System.err.println("email: " + user.getEmail());
        System.out.println("passwordHash: " + user.getPasswordHash());
        System.err.println("role: " + user.getRole());

        if (user.getEmail() == null || user.getEmail().isBlank() || !EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            throw new RuntimeException("Invalid email address.");
        }

        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        if (!PASSWORD_PATTERN.matcher(user.getPasswordHash()).matches()) {
            throw new RuntimeException("Password must be at least 8 characters, include at least one uppercase letter and one number.");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public Employee getEmployeeByUserEmail(String email) {
        return employeeRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found for user email: " + email));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void updatePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new RuntimeException("Current password is required.");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("New password is required.");
        }

        if (!PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new RuntimeException("Password must be at least 8 characters, include at least one uppercase letter and one number.");
        }

        String storedPassword = user.getPasswordHash();
        boolean currentPasswordMatches;

        // Keep updates working for legacy records that may still store plain-text values.
        if (storedPassword != null && storedPassword.startsWith("$2")) {
            currentPasswordMatches = passwordEncoder.matches(currentPassword, storedPassword);
        } else {
            currentPasswordMatches = currentPassword.equals(storedPassword);
        }

        if (!currentPasswordMatches) {
            throw new RuntimeException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

