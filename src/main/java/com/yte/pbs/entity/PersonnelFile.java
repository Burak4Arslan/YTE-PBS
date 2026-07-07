package com.yte.pbs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "personnel_files")
@Getter
@Setter
public class PersonnelFile extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @JsonIgnore
    @Column(
            name = "file_data",
            nullable = false,
            columnDefinition = "BYTEA"
    )
    private byte[] fileData;
}
