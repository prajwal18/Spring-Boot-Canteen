package io.prajwal.canteen.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static boolean hasRole(String roleName) {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(roleName));
    }
}
