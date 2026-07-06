package com.yte.pbs.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sample_product")
@Getter
@Setter
public class SampleProduct extends BaseEntity {

    private String name;
    private Double price;

    public SampleProduct() {
    }

    public SampleProduct(String name, Double price) {
        this.name = name;
        this.price = price;
    }
}
