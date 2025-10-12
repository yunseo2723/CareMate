package me.hys.carematebackend.ownership;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.repository.CareMateAdminRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Ownership {
    private final CareMateAdminRepository repo;

    public boolean isCareMateAdmin(Authentication auth, Long careMateId) {
        var user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        return repo.existsByUserIdAndCareMateId(user.getId(), careMateId);
    }
}
