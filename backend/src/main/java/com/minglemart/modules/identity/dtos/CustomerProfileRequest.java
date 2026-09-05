package com.minglemart.modules.identity.dtos;

/**
 * A partial preference update.
 *
 * <p>Every field is a boxed {@code Boolean} so null means "leave this alone".
 * With primitives, a client sending only {@code isEmailNotified} would silently
 * switch every other flag off.
 */
public record CustomerProfileRequest(
        Boolean isActivityTracked,
        Boolean isDataShared,
        Boolean isEmailNotified,
        Boolean isSecurityNotified,
        Boolean isUpdateNotified,
        Boolean agentEnabled) {
}
