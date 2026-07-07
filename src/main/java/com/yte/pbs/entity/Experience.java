package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "experiences")
@Getter
@Setter
public class Experience extends BaseEntity {

    @Column(name = "work_place", nullable = false)
    private String workPlace;

    @Column(nullable = false)
    private String role;

    @Column(name = "work_type")
    private String workType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "reason_of_leave", length = 500)
    private String reasonOfLeave;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Experience() {}
}