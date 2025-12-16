package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.admin.AdminVerifyApproveDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRejectDto;
import me.hys.carematebackend.dto.admin.AdminVerifyRequest;
import me.hys.carematebackend.model.FacilityAdmin;
import me.hys.carematebackend.model.LtcAdminVerification;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.FacilityAdminRepository;
import me.hys.carematebackend.repository.LtcAdminVerificationRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcAdminVerifyService {

    private final LtcAdminVerificationRepository repo;
    private final UserRepository userRepository;
    private final FacilityAdminRepository facilityAdminRepository;

    /** 인증 요청 저장 **/
    public void requestVerification(
            AdminVerifyRequest dto,
            String fileUrl,
            String uploaderEmail,
            Long uploaderId) {
        repo.save(
                LtcAdminVerification.builder()
                        .facilityName(dto.getFacilityName())
                        .facilityAddress(dto.getFacilityAddress())
                        .businessDocUrl(fileUrl)
                        .uploaderEmail(uploaderEmail) // 이메일만 저장하는 구조
                        .uploaderId(uploaderId)
                        .status("PENDING")
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    /** 리스트 조회 **/
    public List<LtcAdminVerification> list() {
        return repo.findAll();
    }

    /** 승인 처리 → FacilityAdmin 생성까지 포함 **/
    public void approve(AdminVerifyApproveDto dto) {

        // 승인 요청 찾기
        LtcAdminVerification v = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("요청 없음"));

        String instCode = dto.getInstCode();

        // 승인 처리
        v.setInstCode(instCode);
        v.setStatus("APPROVED");
        v.setReviewedAt(LocalDateTime.now());

        // 업로더 유저 찾기
        if (v.getUploaderEmail() == null) {
            throw new RuntimeException("업로더 이메일 정보가 없어 관리자 등록을 할 수 없습니다.");
        }

        User uploader = userRepository.findByUsername(v.getUploaderEmail())
                .orElseThrow(() -> new RuntimeException("업로더 유저 없음"));

        // FacilityAdmin 생성
        boolean exists = facilityAdminRepository
                .existsByUserIdAndInstCode(uploader.getId(), instCode);

        if (!exists) {
            FacilityAdmin admin = FacilityAdmin.builder()
                    .instCode(instCode)
                    .user(uploader)
                    .createdAt(LocalDateTime.now())
                    .build();

            facilityAdminRepository.save(admin);
        }

        // 승인 요청 저장
        repo.save(v);
    }

    /** 반려 처리 **/
    public void reject(AdminVerifyRejectDto dto) {
        LtcAdminVerification v = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("요청 없음"));

        v.setStatus("REJECTED");
        v.setRejectReason(dto.getReason());
        v.setReviewedAt(LocalDateTime.now());

        repo.save(v);
    }
}
