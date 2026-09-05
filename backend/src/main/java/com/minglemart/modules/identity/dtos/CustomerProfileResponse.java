package com.minglemart.modules.identity.dtos;

import com.minglemart.modules.identity.models.CustomerProfileModel;

/** Preference flags as the profile screen reads them. */
public record CustomerProfileResponse(
        boolean isActivityTracked,
        boolean isDataShared,
        boolean isEmailNotified,
        boolean isSecurityNotified,
        boolean isUpdateNotified,
        boolean agentEnabled) {

    public static CustomerProfileResponse from(CustomerProfileModel profile) {
        return new CustomerProfileResponse(
                profile.isActivityTracked(),
                profile.isDataShared(),
                profile.isEmailNotified(),
                profile.isSecurityNotified(),
                profile.isUpdateNotified(),
                profile.isAgentEnabled());
    }
}
