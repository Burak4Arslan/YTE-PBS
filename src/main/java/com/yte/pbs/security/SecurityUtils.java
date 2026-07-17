package com.yte.pbs.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static void verifyOwnership(Long ownerUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Oturum bulunamadı.");
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (isAdmin) {
            return;
        }

        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            if (userDetails.getUser().getId().equals(ownerUserId)) {
                return;
            }
        }

        throw new AccessDeniedException("Bu kayıt üzerinde işlem yapma yetkiniz bulunmamaktadır.");
    }
}
