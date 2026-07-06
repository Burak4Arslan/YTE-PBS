package com.yte.pbs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "news")
@Getter
@Setter
public class News extends BaseEntity {

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "content", length = 1000)
    private String content;

    public News() {
    }
}