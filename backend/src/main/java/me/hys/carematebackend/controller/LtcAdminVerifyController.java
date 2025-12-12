package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.admin.AdminVerifyApproveDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRejectDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRequest;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.model.LtcAdminVerification;
import me.hys.carematebackend.service.LtcAdminVerifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/verify")
@RequiredArgsConstructor
public class LtcAdminVerifyController {

    private final LtcAdminVerifyService service;

    // 인증 요청 (파일 업로드 포함)
    @PostMapping("/request")
    public ResponseEntity<?> requestVerify(
            @AuthenticationPrincipal CustomUserDetails cud,   // ← 로그인 사용자
            @RequestPart("facilityName") String name,
            @RequestPart("facilityAddress") String address,
            @RequestPart("file") MultipartFile file
    ) {

        if (cud == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String uploaderEmail = cud.getUser().getUsername();
        Long uploaderId = cud.getUser().getId();

        String fileUrl = "/uploaded/" + file.getOriginalFilename(); // TODO: S3 업로드 처리

        AdminVerifyRequest dto = new AdminVerifyRequest();
        dto.setFacilityName(name);
        dto.setFacilityAddress(address);

        service.requestVerification(dto, fileUrl, uploaderEmail, uploaderId);

        return ResponseEntity.ok("OK");
    }


    // 목록 조회 (운영자)
    @GetMapping("/list")
    public List<LtcAdminVerification> list() {
        return service.list();
    }

    // 승인
    @PostMapping("/approve")
    public String approve(@RequestBody AdminVerifyApproveDto dto) {
        service.approve(dto);
        return "OK";
    }

    // 반려
    @PostMapping("/reject")
    public String reject(@RequestBody AdminVerifyRejectDto dto) {
        service.reject(dto);
        return "OK";
    }
}