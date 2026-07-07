package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project extends BaseEntity{



    @Column(name = "project_name", nullable = false, unique=true)
    private String projectName;

    @Column(name = "begin_date", nullable = false)
    private LocalDate beginDate;


    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

}

