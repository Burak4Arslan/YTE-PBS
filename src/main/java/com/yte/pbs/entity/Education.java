package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "educations")
@Data
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "education_type", nullable = false)
    private String educationType;

    @Column(name = "school_name", nullable = false)
    private String schoolName;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "graduation_date")
    private LocalDate graduationDate;

    @Column(name = "description", length = 500)
    private String description;
}