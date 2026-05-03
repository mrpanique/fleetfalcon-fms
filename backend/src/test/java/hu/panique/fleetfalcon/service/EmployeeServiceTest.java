package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = new Employee();
        testEmployee.setId(1L);
        testEmployee.setEmployeeId("EMP-001");
        testEmployee.setFirstName("János");
        testEmployee.setLastName("Kovács");
        testEmployee.setDepartment("Sales");
    }

    @Test
    void testGetAllEmployees_ReturnsAllEmployees() {
        List<Employee> employees = List.of(testEmployee);
        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("EMP-001", result.get(0).getEmployeeId());
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    void testGetEmployees_ByEmployeeId_ReturnsEmployee() {
        when(employeeRepository.findByEmployeeIdIgnoreCase("EMP-001"))
                .thenReturn(Optional.of(testEmployee));

        List<Employee> result = employeeService.getEmployees(null, "EMP-001");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("EMP-001", result.get(0).getEmployeeId());
    }

    @Test
    void testGetEmployees_NoFilters_ReturnsAllEmployees() {
        List<Employee> employees = List.of(testEmployee);
        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getEmployees(null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    void testCreateEmployee_ValidInput_Success() {
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee result = employeeService.createEmployee(testEmployee);

        assertNotNull(result);
        assertEquals("János", result.getFirstName());
        assertEquals("EMP-001", result.getEmployeeId());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testGetEmployeeById_EmployeeExists_ReturnsEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        Employee result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Kovács", result.getLastName());
    }

    @Test
    void testDeleteEmployee_ValidId_Success() {
        doNothing().when(employeeRepository).deleteById(1L);

        assertDoesNotThrow(() -> {
            employeeService.deleteEmployee(1L);
        });

        verify(employeeRepository, times(1)).deleteById(1L);
    }
}
