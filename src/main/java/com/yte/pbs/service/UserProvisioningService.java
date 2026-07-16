package com.yte.pbs.service;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.Personnel;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.Optional;

/**
 * Keeps the "users" (login) table in sync with the "personnel" (HR record) table.
 * The two are intentionally separate entities (User carries auth/security fields
 * Personnel has no business needing), but every real personnel record should have
 * a matching login account. This is the single place that creates that link, so
 * DataInitializer's seed data and PersonnelService's admin-created records can't
 * drift out of sync with each other.
 */
@Service
@RequiredArgsConstructor
public class UserProvisioningService {

    private static final String DEFAULT_AUTHORITY = "EMPLOYEE";

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a login account for the given personnel if one doesn't already exist.
     * Returns empty (no-op) when the personnel has no email to key a unique login on,
     * or when a user with that email is already registered.
     */
    public Optional<User> provisionForPersonnel(Personnel personnel) {
        if (!StringUtils.hasText(personnel.getEmail())) {
            return Optional.empty();
        }
        if (userRepository.findByEmail(personnel.getEmail()).isPresent()) {
            return Optional.empty();
        }

        Authority employeeAuthority = authorityRepository.findByName(DEFAULT_AUTHORITY)
                .orElseThrow(() -> new IllegalStateException(
                        "Cannot provision a user account: '" + DEFAULT_AUTHORITY + "' authority is not seeded yet."));

        User user = new User();
        user.setUsername(generateUniqueUsername(personnel.getFirstName(), personnel.getLastName()));
        user.setEmail(personnel.getEmail());
        // İlk giriş şifresi olarak T.C. kimlik numarası kullanılır; kullanıcı ilk
        // girişte değiştirebilir. Boş bırakılamayan password alanı için de gereklidir.
        user.setPassword(passwordEncoder.encode(personnel.getTcIdentityNumber()));
        user.setFirstName(personnel.getFirstName());
        user.setLastName(personnel.getLastName());
        user.setGender(personnel.getGender());
        user.setAcademicTitle(personnel.getAcademicTitle());
        user.setBirthDate(personnel.getBirthDate());
        user.setBloodType(personnel.getBloodType());
        user.setPhoneNumber(personnel.getPhoneNumber());
        user.setResidentialAddress(personnel.getResidentialAddress());
        user.setEmploymentStartDate(personnel.getHireDate());
        user.setRegistrationNumber(personnel.getRegistrationNumber());
        user.setCadre(personnel.getCadre());
        user.setTitle(personnel.getTitle());
        user.setUnit(personnel.getDepartment());
        user.setCurrentProject(personnel.getProjectWorkedOn());
        user.setDuty(personnel.getDuty());
        user.setPersonnelType(personnel.getPersonnelType());
        user.setWorkType(personnel.getWorkType());
        user.setWorkStatus(personnel.getWorkStatus());
        user.setRoomNumber(personnel.getRoomNumber());
        user.setProfileImageUrl(personnel.getPhotoUrl());
        user.setPersonnelId(personnel.getId());
        user.getAuthorities().add(employeeAuthority);

        return Optional.of(userRepository.save(user));
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String base = normalize(firstName) + "." + normalize(lastName);
        String candidate = base;
        int suffix = 1;
        while (userRepository.findByUsername(candidate).isPresent()) {
            suffix++;
            candidate = base + suffix;
        }
        return candidate;
    }

    private String normalize(String value) {
        String withoutTurkishChars = value.trim()
                .replace('İ', 'i').replace('I', 'i').replace('ı', 'i')
                .replace('Ğ', 'g').replace('ğ', 'g')
                .replace('Ü', 'u').replace('ü', 'u')
                .replace('Ş', 's').replace('ş', 's')
                .replace('Ö', 'o').replace('ö', 'o')
                .replace('Ç', 'c').replace('ç', 'c');
        return withoutTurkishChars.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }
}
