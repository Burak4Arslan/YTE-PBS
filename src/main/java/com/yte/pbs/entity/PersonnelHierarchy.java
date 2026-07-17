package com.yte.pbs.entity;

import com.yte.pbs.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "personnel_hierarchy")
@Getter
@Setter
public class PersonnelHierarchy extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "personnel_name", nullable = false)
    private String personnelName;

    @Column(name = "personnel_surname", nullable = false)
    private String personnelSurname;

    @Column(name = "personnel_job_title", nullable = false)
    private String personnelJobTitle;

    @Column(name = "department")
    private String department;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "project_worked_on")
    private String projectWorkedOn;

    @Column(name = "team")
    private String team;

    @ManyToOne
    @JoinColumn(name = "superior_personnel_id")
    private PersonnelHierarchy superiorPersonnel;

    @OneToMany(mappedBy = "superiorPersonnel")
    private List<PersonnelHierarchy> subordinates;


}