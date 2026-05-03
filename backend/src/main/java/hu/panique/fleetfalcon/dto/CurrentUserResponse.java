package hu.panique.fleetfalcon.dto;

import hu.panique.fleetfalcon.model.User;

public record CurrentUserResponse(
        Long id,
        String email,
        User.UserRole role,
        String employeeId
) {
}