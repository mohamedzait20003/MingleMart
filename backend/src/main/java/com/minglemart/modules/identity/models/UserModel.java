package com.minglemart.modules.identity.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.SoftDeletableModel;
import com.minglemart.shared.enums.Gender;

@Entity
@Table(name = "users")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserModel extends SoftDeletableModel {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    /** Null for accounts created purely through an OAuth provider. */
    private String passwordHash;

    @Column(nullable = false)
    private String fname;

    @Column(nullable = false)
    private String lname;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private Gender gender;

    private LocalDate dateOfBirth;

    private String profilePicUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private RoleModel role;

    @Builder.Default
    private String locale = "en";

    @Builder.Default
    private String timeZone = "UTC";

    @Builder.Default
    @Column(name = "is_verified")
    private boolean verified = false;

    @Builder.Default
    @Column(name = "is_active")
    private boolean active = true;


    public String displayName() {
        return fname + " " + lname;
    }
}
