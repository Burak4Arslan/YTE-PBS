package com.yte.pbs.controller;

import com.yte.pbs.dto.LoginRequest;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.UserRepository;
import com.yte.pbs.security.CustomUserDetails;
import com.yte.pbs.service.AttendanceRecordService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AttendanceRecordService attendanceRecordService;
    private final UserRepository userRepository;

    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        if (loginRequest == null
                || loginRequest.usernameOrEmail() == null
                || loginRequest.usernameOrEmail().isBlank()
                || loginRequest.password() == null
                || loginRequest.password().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Kullanıcı adı/e-posta ve şifre alanları zorunludur.");
        }

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            UsernamePasswordAuthenticationToken.unauthenticated(
                                    loginRequest.usernameOrEmail(),
                                    loginRequest.password()
                            )
                    );

            SecurityContext securityContext =
                    SecurityContextHolder.createEmptyContext();

            securityContext.setAuthentication(authentication);

            if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
                attendanceRecordService.recordLogin(userDetails.getUser());
            }

            SecurityContextHolder.setContext(securityContext);

            securityContextRepository.saveContext(
                    securityContext,
                    request,
                    response
            );

            java.util.Map<String, Object> responseBody = new java.util.HashMap<>();
            responseBody.put("message", "Login successful.");

            java.util.List<String> roles = authentication.getAuthorities().stream()
                    .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                    .toList();
            responseBody.put("authorities", roles);

            return ResponseEntity.ok(responseBody);

        } catch (BadCredentialsException exception) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid username/email or password.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) throws ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        resolveAuthenticatedUser(authentication).ifPresent(attendanceRecordService::recordLogout);

        request.logout();
        return ResponseEntity.ok("Logout successful.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Oturum bulunamadı.");
        }

        String username = authentication.getName();
        var roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "username", username,
                "roles", roles
        ));
    }

    private java.util.Optional<User> resolveAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return java.util.Optional.empty();
        }

        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return java.util.Optional.of(userDetails.getUser());
        }

        return userRepository.findByUsernameOrEmail(authentication.getName(), authentication.getName());
    }
}
