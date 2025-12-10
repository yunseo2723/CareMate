package me.hys.carematebackend.service;

import me.hys.carematebackend.dto.admin.AdminVerifyApproveDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRejectDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRequest;
import me.hys.carematebackend.model.LtcAdminVerification;
import me.hys.carematebackend.repository.LtcAdminVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcAdminVerifyService {

    private final LtcAdminVerificationRepository repo;

    // 인증 요청
    public LtcAdminVerification requestVerification(AdminVerifyRequest dto, String fileUrl, String uploaderEmail) {
        return repo.save(
                LtcAdminVerification.builder()
                        .facilityName(dto.getFacilityName())
                        .facilityAddress(dto.getFacilityAddress())
                        .businessDocUrl(fileUrl)
                        .uploaderEmail(uploaderEmail)
                        .status("PENDING")
                        .build()
        );
    }

    // 목록 조회
    public List<LtcAdminVerification> list() {
        return repo.findAll();
    }

    // 승인
    public void approve(AdminVerifyApproveDto dto) {
        LtcAdminVerification v = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("요청 없음"));

        v.setInstCode(dto.getInstCode());
        v.setStatus("APPROVED");
        v.setReviewedAt(LocalDateTime.now());

        repo.save(v);
    }

    // 반려
    public void reject(AdminVerifyRejectDto dto) {
        LtcAdminVerification v = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("요청 없음"));

        v.setStatus("REJECTED");
        v.setRejectReason(dto.getReason());
        v.setReviewedAt(LocalDateTime.now());

        repo.save(v);
    }
}
