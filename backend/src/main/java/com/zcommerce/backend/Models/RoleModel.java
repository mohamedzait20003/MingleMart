package com.zcommerce.backend.Models;

import lombok.*;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;


@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "roles",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_roles_name", columnNames = "name")
    },
    indexes = {
        @Index(name = "idx_roles_name", columnList = "name")
    }
)
public class RoleModel extends BaseModel {

    @Column(name = "name", nullable = false, unique = true, length = 30)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns        = @JoinColumn(name = "role_id",       foreignKey = @ForeignKey(name = "fk_rp_role")),
        inverseJoinColumns = @JoinColumn(name = "permission_id", foreignKey = @ForeignKey(name = "fk_rp_permission"))
    )
    @Builder.Default
    private Set<PermissionModel> permissions = new HashSet<>();
}
