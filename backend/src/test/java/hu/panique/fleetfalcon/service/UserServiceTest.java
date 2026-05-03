package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.User;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import hu.panique.fleetfalcon.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("ValidPassword123");
        testUser.setRole(User.UserRole.EMPLOYEE);
    }

    @Test
    void testCreateUser_ValidInput_Success() {
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.createUser(testUser);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_InvalidEmail_ThrowsException() {
        testUser.setEmail("invalid-email");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(testUser);
        });

        assertEquals("Invalid email address.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_WeakPassword_ThrowsException() {
        testUser.setPasswordHash("weak");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(testUser);
        });

        assertTrue(exception.getMessage().contains("Password must be at least 8 characters"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testGetUserById_UserExists_ReturnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void testGetUserById_UserNotFound_ThrowsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(999L);
        });

        assertEquals("User not found with id: 999", exception.getMessage());
    }

    @Test
    void testUpdatePassword_ValidNewPassword_Success() {
        testUser.setPasswordHash("Old123Password");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("Old123Password", testUser.getPasswordHash())).thenReturn(true);
        when(passwordEncoder.encode("NewPassword456")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> {
            userService.updatePassword(1L, "Old123Password", "NewPassword456");
        });

        verify(userRepository, times(1)).save(any(User.class));
    }
}
