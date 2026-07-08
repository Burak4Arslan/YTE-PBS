package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "contributions")
@Getter
@Setter
public class Contribution extends BaseEntity {

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(nullable = false, length = 1000)
    private String description;

    private String link;

    @Column(name = "attached_file_path")
    private String attachedFilePath;

    @Column(name = "upload_date", nullable = false)
    private LocalDate uploadDate;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Contribution() {}
}