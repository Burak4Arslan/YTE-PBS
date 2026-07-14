package com.yte.pbs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
public class User extends BaseEntity {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "national_identity_number")
    private String nationalIdentityNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "academic_title")
    private String academicTitle;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "vehicle_plate")
    private String vehiclePlate;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "residential_address", length = 1000)
    private String residentialAddress;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "employment_start_date")
    private LocalDate employmentStartDate;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "cadre")
    private String cadre;

    @Column(name = "title")
    private String title;

    @Column(name = "unit")
    private String unit;

    @Column(name = "current_project")
    private String currentProject;

    @Column(name = "duty")
    private String duty;

    @Column(name = "personnel_type")
    private String personnelType;

    @Column(name = "work_type")
    private String workType;

    @Column(name = "work_status")
    private String workStatus;

    @Column(name = "uses_shuttle_service")
    private Boolean usesShuttleService;

    @Column(name = "internal_phone_number")
    private String internalPhoneNumber;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "personnel_id")
    private Long personnelId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_authorities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id")
    )
    private Set<Authority> authorities = new HashSet<>();

    public User() {
    }

    public Set<String> getRoles() {
        return authorities.stream()
                .map(Authority::getName)
                .collect(Collectors.toSet());
    }

    public void setRoles(Set<Authority> roles){
        this.authorities = roles;
    }

}
