package com.minglemart.modules.identity.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.BaseModel;


@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileModel extends BaseModel {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserModel user;

    // --- privacy ---

    @Builder.Default
    @Column(name = "is_activity_tracked", nullable = false)
    private boolean activityTracked = false;

    @Builder.Default
    @Column(name = "is_data_shared", nullable = false)
    private boolean dataShared = false;

    // --- notifications ---

    @Builder.Default
    @Column(name = "is_email_notified", nullable = false)
    private boolean emailNotified = true;

    @Builder.Default
    @Column(name = "is_security_notified", nullable = false)
    private boolean securityNotified = true;

    @Builder.Default
    @Column(name = "is_update_notified", nullable = false)
    private boolean updateNotified = true;

    // --- assistant ---

    /** Whether the chat assistant may act on this account's behalf. */
    @Builder.Default
    @Column(name = "agent_enabled", nullable = false)
    private boolean agentEnabled = true;
}
