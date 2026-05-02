package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.User;
import hu.panique.fleetfalcon.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            throw new RuntimeException("Password is required.");
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

