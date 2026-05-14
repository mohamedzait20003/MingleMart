package com.zcommerce.backend.Models;

import lombok.*;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(
    name = "permissions",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_permissions_name", columnNames = "name")
    },
    indexes = {
        @Index(name = "idx_permissions_name", columnList = "name")
    }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionModel extends BaseModel {

    @Column(name = "name", nullable = false, unique = true, length = 60)
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "permissions")
    @Builder.Default
    private Set<RoleModel> roles = new HashSet<>();
}
