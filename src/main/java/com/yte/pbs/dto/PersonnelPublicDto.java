package com.yte.pbs.dto;

import com.yte.pbs.entity.Personnel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PersonnelPublicDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String academicTitle;
    private LocalDate hireDate;
    private String registrationNumber;
    private String cadre;
    private String title;
    private String personnelType;
    private String workType;
    private String workStatus;
    private String department;
    private String duty;
    private String team;
    private String projectWorkedOn;
    private String photoUrl;
    private String phoneNumber;
    private String extensionNumber;
    private String roomNumber;

    public PersonnelPublicDto(Personnel personnel) {
        this.id = personnel.getId();
        this.firstName = personnel.getFirstName();
        this.lastName = personnel.getLastName();
        this.email = personnel.getEmail();
        this.gender = personnel.getGender();
        this.academicTitle = personnel.getAcademicTitle();
        this.hireDate = personnel.getHireDate();
        this.registrationNumber = personnel.getRegistrationNumber();
        this.cadre = personnel.getCadre();
        this.title = personnel.getTitle();
        this.personnelType = personnel.getPersonnelType();
        this.workType = personnel.getWorkType();
        this.workStatus = personnel.getWorkStatus();
        this.department = personnel.getDepartment();
        this.duty = personnel.getDuty();
        this.team = personnel.getTeam();
        this.projectWorkedOn = personnel.getProjectWorkedOn();
        this.photoUrl = personnel.getPhotoUrl();
        this.phoneNumber = personnel.getPhoneNumber();
        this.extensionNumber = personnel.getExtensionNumber();
        this.roomNumber = personnel.getRoomNumber();
    }
}
