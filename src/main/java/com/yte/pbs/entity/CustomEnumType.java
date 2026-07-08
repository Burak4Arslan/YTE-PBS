package com.yte.pbs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "custom_enum_types",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_custom_enum_type_code",
                        columnNames = "code"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomEnumType extends BaseEntity {

    @Column(name = "code", nullable = false, length = 80)
    private String code;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
