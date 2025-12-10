package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.admin.AdminVerifyApproveDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRejectDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRequest;
import me.hys.carematebackend.model.LtcAdminVerification;
import me.hys.carematebackend.service.LtcAdminVerifyService;
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
    public String requestVerify(
            @RequestPart("facilityName") String name,
            @RequestPart("facilityAddress") String address,
            @RequestPart("file") MultipartFile file
    ) {

        String fileUrl = "/uploaded/" + file.getOriginalFilename(); // TODO: S3 업로드 처리

        AdminVerifyRequest dto = new AdminVerifyRequest();
        dto.setFacilityName(name);
        dto.setFacilityAddress(address);

        service.requestVerification(dto, fileUrl, null);

        return "OK";
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