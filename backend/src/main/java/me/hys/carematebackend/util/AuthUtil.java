package me.hys.carematebackend.util;

import me.hys.carematebackend.code.ErrorCode;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.exception.CustomException;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final UserRepository userRepository;

    public User extractUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return userRepository.findByUsername(customUserDetails.getUsername())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        } else if (principal instanceof User user) {
            return userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        } else {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
    }
}
