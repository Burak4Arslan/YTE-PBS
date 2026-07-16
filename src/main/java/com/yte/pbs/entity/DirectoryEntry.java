package com.yte.pbs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "directory_entries")
@Getter
@Setter
public class DirectoryEntry extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "unit")
    private String unit;

    @Column(name = "title")
    private String title;

    @Column(name = "duty")
    private String duty;

    @Column(name = "project")
    private String project;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "photo_url")
    private String photoUrl;

    // Boş constructor (JPA için zorunlu)
    public DirectoryEntry() {
    }

    // İleride örnek veri basarken kolaylık olsun diye parametreli constructor
    public DirectoryEntry(String fullName, String unit, String title, String duty, String project, String email,
            String phoneNumber) {
        this.fullName = fullName;
        this.unit = unit;
        this.title = title;
        this.duty = duty;
        this.project = project;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}