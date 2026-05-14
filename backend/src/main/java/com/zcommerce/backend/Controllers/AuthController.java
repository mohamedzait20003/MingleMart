package com.zcommerce.backend.Controllers;

import java.time.Duration;
import jakarta.validation.Valid;
import com.zcommerce.backend.Dtos.*;
import com.zcommerce.backend.Models.*;
import com.zcommerce.backend.Services.*;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    private final UserService userService;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final SessionService sessionService;

    public AuthController(UserService userService, TokenService tokenService, EmailService emailService, SessionService sessionService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.emailService = emailService;
        this.sessionService = sessionService;
    }

    @PostMapping("sign-up")
    public ResponseEntity<? extends BaseDto> Register(@Valid @RequestBody RegisterReqDto req) {
        try {
            UserModel newUser = userService.create(req);

            String tokenValue = tokenService.create(
                newUser,
                TokenModel.TokenType.EMAIL_VERIFICATION,
                Duration.ofHours(24)
            );

            String verificationUrl = "https://yourdomain.com/verify?token=" + tokenValue;
            this.emailService.sendVerificationEmail(newUser.getEmail(), newUser.getUsername(), verificationUrl);

            return ResponseEntity.status(201).body(BaseResDto.of("Registration successful. Check your email."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(BaseResDto.of(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(BaseResDto.of("An unexpected error occurred."));
        }
    }

    @PostMapping("sign-in")
    public ResponseEntity<? extends BaseDto> Login(@Valid @RequestBody LoginReqDto req) {
        try {
            UserModel user = userService.checkUser(req.email(), req.password());

            if(user.getEnabled() == false) {
                String tokenValue = tokenService.create(
                    user,
                    TokenModel.TokenType.EMAIL_VERIFICATION,
                    Duration.ofHours(24)
                );

                String verificationUrl = "https://yourdomain.com/verify?token=" + tokenValue;
                this.emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), verificationUrl);

                return ResponseEntity.status(403).body(BaseResDto.of("Account not verified. Please check your email."));
            }

            String accessToken = sessionService.create(user);
            return ResponseEntity.status(201).body(new LoginResDto(
                "Login successful",
                accessToken,
                new LoginResDto.UserData(user.getUsername(), user.getEmail())
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(BaseResDto.of(e.getMessage()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(BaseResDto.of(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(BaseResDto.of("An unexpected error occurred."));
        }
    }
}
