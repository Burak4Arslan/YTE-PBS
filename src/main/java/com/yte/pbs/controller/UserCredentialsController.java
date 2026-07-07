package com.yte.pbs.controller;

import com.yte.pbs.dto.UserCredentialsResponse;
import com.yte.pbs.dto.UserCredentialsUpdateRequest;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/personel/hakkımda")
public class UserCredentialsController {

    private final UserRepository userRepository;

    public UserCredentialsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public UserCredentialsResponse getMyCredentials() {
        return UserCredentialsResponse.fromEntity(currentUser());
    }

    @PutMapping
    public UserCredentialsResponse updateMyCredentials( @RequestBody UserCredentialsUpdateRequest update) {
        User user = currentUser();

        user.setBirthDate(update.birthDate());
        user.setBloodType(update.bloodType());
        user.setPhoneNumber(update.phoneNumber());
        user.setVehiclePlate(update.vehiclePlate());
        user.setEmergencyContactName(update.emergencyContactName());
        user.setEmergencyContactPhone(update.emergencyContactPhone());
        user.setResidentialAddress(update.residentialAddress());
        user.setInternalPhoneNumber(update.internalPhoneNumber());
        user.setRoomNumber(update.roomNumber());

        return UserCredentialsResponse.fromEntity(userRepository.save(user));
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usernameOrEmail = auth.getName();
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + usernameOrEmail));
    }
}
