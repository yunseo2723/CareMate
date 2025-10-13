package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.service.AdminOnboardingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/onboarding")
public class AdminOnboardingController {

    private final AdminOnboardingService svc;

    @PostMapping("/request-code")
    public Map<String, String> request(@RequestBody Map<String, Long> body, Authentication auth) {
        Long careMateId = body.get("careMateId");
        String masked = svc.requestCode(auth, careMateId);
        return Map.of("maskedPhone", masked);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, String> body, Authentication auth) {
        Long careMateId = Long.valueOf(body.get("careMateId"));
        String code = body.get("code");
        svc.verify(auth, careMateId, code);
        return Map.of("result", "OK");
    }
}
