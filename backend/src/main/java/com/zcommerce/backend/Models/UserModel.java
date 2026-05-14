package com.zcommerce.backend.Models;

import lombok.*;
import java.util.List;
import java.time.LocalDate;
import java.util.Collection;
import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Entity
@Getter
@Setter
@SuperBuilder
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uk_users_email",    columnNames = "email")
    },
    indexes = {
        @Index(name = "idx_users_username", columnList = "username"),
        @Index(name = "idx_users_email",    columnList = "email")
    }
)
@NoArgsConstructor
@AllArgsConstructor
public class UserModel extends BaseModel implements UserDetails {
    @NotBlank
    @Size(min = 3, max = 50)
    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @NotBlank
    @Column(name = "password", nullable = false)
    private String password;

    // - Profile --

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 20)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    // - Locale --

    @Column(name = "language", nullable = false, length = 10)
    @Builder.Default
    private String language = "en";

    @Column(name = "country", nullable = false, length = 10)
    @Builder.Default
    private String country = "US";

    // - Security Flags --

    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private Boolean enabled = false;

    @Column(name = "2fa_enabled", nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    // - Prefernces --

    @Column(name = "is_activity_tracked", nullable = false)
    @Builder.Default
    private boolean isActivityTracked = true;

    @Column(name = "is_data_shared", nullable = false)
    @Builder.Default
    private boolean isDataShared = false;

    @Column(name = "is_email_notified", nullable = false)
    @Builder.Default
    private boolean isEmailNotified = true;

    @Column(name = "is_security_notified", nullable = false)
    @Builder.Default
    private boolean isSecurityNotified = true;

    @Column(name = "is_update_notified", nullable = false)
    @Builder.Default
    private boolean isUpdateNotified = true;

    // - Authorities --

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(name = "fk_users_role"))
    private RoleModel role;

    // - Relations --

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TokenModel> tokens = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SessionModel> sessions = new ArrayList<>();

    // ── UserDetails ──────────────────────────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.getName()));
        role.getPermissions().forEach(p ->
            authorities.add(new SimpleGrantedAuthority(p.getName()))
        );
        return authorities;
    }

    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }
}
