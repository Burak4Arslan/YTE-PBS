package com.yte.pbs.dto;

import java.time.LocalDate;

// Kullanıcının kendi kendine değiştirebildiği alanlar bunlarla sınırlıdır.
// Kimlik ve kurumsal alanlar (unvan, birim, sicil no, vb.) değiştirilemez.
public record UserCredentialsUpdateRequest(
        LocalDate birthDate,
        String bloodType,
        String phoneNumber,
        String vehiclePlate,
        String emergencyContactName,
        String emergencyContactPhone,
        String residentialAddress,
        String internalPhoneNumber,
        String roomNumber) {
}