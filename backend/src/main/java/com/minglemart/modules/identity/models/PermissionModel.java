package com.minglemart.modules.identity.models;

import lombok.*;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.BaseModel;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionModel extends BaseModel {

    @Column(nullable = false, unique = true, length = 128)
    private String name;

    private String description;
}
