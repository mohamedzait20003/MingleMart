package com.minglemart.modules.identity.models;

import lombok.*;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.BaseModel;

@Entity
@Table(name = "roles")
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class RoleModel extends BaseModel {

    @Column(nullable = false, unique = true, length = 64)
    private String name;

    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private Set<PermissionModel> permissions = new HashSet<>();
}
