package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Entity
@Table(name = "user_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProject extends BaseEntity{

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "begin_date", nullable = false)
    private LocalDate beginDate;

    @Column(name = "duty", nullable = false)
    private String duty;


    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

}

