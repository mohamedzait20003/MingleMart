package com.zcommerce.backend.Services;

import java.util.UUID;
import java.util.List;
import java.time.LocalDate;
import com.zcommerce.backend.Dtos.*;
import com.zcommerce.backend.Models.*;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import com.zcommerce.backend.Repositories.RoleRepository;
import com.zcommerce.backend.Repositories.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


@Service
public class UserService extends BaseService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserModel create(RegisterReqDto req) {
        if (userRepository.existsByEmail(req.email()))
            throw new IllegalArgumentException("Email already in use.");
        
        if (userRepository.existsByUsername(req.username()))
            throw new IllegalArgumentException("Username already in use.");

        RoleModel role = roleRepository.findByName("ROLE_USER")
            .orElseThrow(() -> new EntityNotFoundException("Default role not found."));

        UserModel user = UserModel.builder()
            .username(req.username())
            .firstName(req.firstName())
            .lastName(req.lastName())
            .email(req.email())
            .password(passwordEncoder.encode(req.password()))
            .role(role)
            .build();

        return userRepository.save(user);
    }

    // - Finders --

    @Transactional(readOnly = true)
    public UserModel findById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteById(UUID id) {
        if (!userRepository.existsById(id))
            throw new EntityNotFoundException("User not found: " + id);
        userRepository.deleteById(id);
    }

    @Transactional
    public UserModel checkUser(String email, String Password) {
        UserModel user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
        
        if (!passwordEncoder.matches(Password, user.getPassword()))
            throw new IllegalArgumentException("Invalid password.");
        
        return user;
    }

    // - UserDetailsService (used by Spring Security) ──────────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // - Password --

    @Transactional
    public UserModel changePassword(UUID id, String oldPassword, String newPassword) {
        UserModel user = findById(id);

        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new IllegalArgumentException("Old password is incorrect.");

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Transactional
    public UserModel resetPassword(UUID id, String newPassword) {
        UserModel user = findById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    // - Profile --

    @Transactional
    public UserModel updateProfile(UUID id, String firstName, String lastName,
                                   String gender, LocalDate dateOfBirth) {
        UserModel user = findById(id);
        if (firstName   != null) user.setFirstName(firstName);
        if (lastName    != null) user.setLastName(lastName);
        if (gender      != null) user.setGender(UserModel.Gender.valueOf(gender.toUpperCase()));
        if (dateOfBirth != null) user.setDateOfBirth(dateOfBirth);
        return userRepository.save(user);
    }

    @Transactional
    public UserModel updateLocale(UUID id, String language, String country) {
        UserModel user = findById(id);
        if (language != null) user.setLanguage(language);
        if (country  != null) user.setCountry(country);
        return userRepository.save(user);
    }

    @Transactional
    public UserModel updateProfilePicture(UUID id, String profilePictureUrl) {
        UserModel user = findById(id);
        user.setProfilePictureUrl(profilePictureUrl);
        return userRepository.save(user);
    }

    // - Preferences --

    @Transactional
    public UserModel updatePreferences(UUID id, Boolean activityTracked, Boolean dataShared,
                                       Boolean emailNotified, Boolean securityNotified,
                                       Boolean updateNotified) {
        UserModel user = findById(id);
        if (activityTracked  != null) user.setActivityTracked(activityTracked);
        if (dataShared       != null) user.setDataShared(dataShared);
        if (emailNotified    != null) user.setEmailNotified(emailNotified);
        if (securityNotified != null) user.setSecurityNotified(securityNotified);
        if (updateNotified   != null) user.setUpdateNotified(updateNotified);
        return userRepository.save(user);
    }

    // - Account --

    @Transactional
    public UserModel enableUser(UUID id) {
        UserModel user = findById(id);
        user.setEnabled(true);
        return userRepository.save(user);
    }
}

