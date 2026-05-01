package hu.panique.fleetfalcon.service;

import hu.panique.fleetfalcon.model.Employee;
import hu.panique.fleetfalcon.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public List<Employee> getEmployees(String name, String employeeId) {
        boolean hasName = hasText(name);
        boolean hasEmployeeId = hasText(employeeId);

        if (!hasName && !hasEmployeeId) {
            return employeeRepository.findAll();
        }

        if (hasEmployeeId) {
            Employee employee = employeeRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found with employeeId: " + employeeId));

            if (!hasName || matchesName(employee, name)) {
                return List.of(employee);
            }
            return Collections.emptyList();
        }

        return employeeRepository.findAll().stream()
                .filter(employee -> matchesName(employee, name))
                .toList();
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmployeeId(employeeDetails.getEmployeeId());
        employee.setUser(employeeDetails.getUser());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setDrivingLicenseNumber(employeeDetails.getDrivingLicenseNumber());
        employee.setDepartment(employeeDetails.getDepartment());

        return employeeRepository.save(employee);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean matchesName(Employee employee, String name) {
        String[] parts = name.trim().toLowerCase().split("\\s+");

        if (parts.length == 1) {
            return employee.getFirstName().toLowerCase().contains(parts[0])
                    || employee.getLastName().toLowerCase().contains(parts[0]);
        }

        return employee.getFirstName().toLowerCase().contains(parts[0])
                && employee.getLastName().toLowerCase().contains(parts[1]);
    }
}