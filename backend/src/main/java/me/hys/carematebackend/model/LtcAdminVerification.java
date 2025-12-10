package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ltc_admin_verification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LtcAdminVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자가 입력한 요양원 이름
    @Column(nullable = false, length = 200)
    private String facilityName;

    // 사용자가 입력한 요양원 주소
    @Column(nullable = false, length = 300)
    private String facilityAddress;

    // 운영자가 승인 시 입력하는 instCode (시설 고유 코드)
    @Column(length = 20)
    private String instCode;

    // 업로더 정보 (선택)
    @Column(length = 200)
    private String uploaderEmail;

    private Long uploaderId;

    // 사업자등록증 업로드 URL (S3 등)
    @Column(nullable = false, length = 500)
    private String businessDocUrl;

    // 상태: PENDING / APPROVED / REJECTED
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    // 반려사유 (선택)
    @Column(length = 500)
    private String rejectReason;

    // 작성일
    private LocalDateTime createdAt = LocalDateTime.now();

    // 운영자 검토일
    private LocalDateTime reviewedAt;
}
