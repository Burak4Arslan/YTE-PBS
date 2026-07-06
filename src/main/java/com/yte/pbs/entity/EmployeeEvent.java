package com.yte.pbs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "employee_events")
@Getter
@Setter
public class EmployeeEvent extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    // Etkinlik tipi: "BIRTHDAY" (Doğum Günü) veya "WELCOME" (Aramıza Hoşgeldin)
    @Column(name = "event_type", nullable = false)
    private String eventType;

    public EmployeeEvent() {
    }
}