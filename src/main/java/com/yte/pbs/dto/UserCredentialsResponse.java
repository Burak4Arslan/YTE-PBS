package com.yte.pbs.dto;

import com.yte.pbs.entity.User;

import java.time.LocalDate;

public record UserCredentialsResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String nationalIdentityNumber,
        String gender,
        String academicTitle,
        LocalDate birthDate,
        String bloodType,
        String phoneNumber,
        String vehiclePlate,
        String emergencyContactName,
        String emergencyContactPhone,
        String residentialAddress,
        String profileImageUrl,
        LocalDate employmentStartDate,
        String registrationNumber,
        String cadre,
        String title,
        String unit,
        String currentProject,
        String duty,
        String personnelType,
        String workType,
        String workStatus,
        Boolean usesShuttleService,
        String internalPhoneNumber,
        String roomNumber) {

    public static UserCredentialsResponse fromEntity(User user) {
        return new UserCredentialsResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getNationalIdentityNumber(),
                user.getGender(),
                user.getAcademicTitle(),
                user.getBirthDate(),
                user.getBloodType(),
                user.getPhoneNumber(),
                user.getVehiclePlate(),
                user.getEmergencyContactName(),
                user.getEmergencyContactPhone(),
                user.getResidentialAddress(),
                user.getProfileImageUrl(),
                user.getEmploymentStartDate(),
                user.getRegistrationNumber(),
                user.getCadre(),
                user.getTitle(),
                user.getUnit(),
                user.getCurrentProject(),
                user.getDuty(),
                user.getPersonnelType(),
                user.getWorkType(),
                user.getWorkStatus(),
                user.getUsesShuttleService(),
                user.getInternalPhoneNumber(),
                user.getRoomNumber());
    }
}

