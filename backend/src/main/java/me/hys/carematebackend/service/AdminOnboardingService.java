package me.hys.carematebackend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.model.*;
import me.hys.carematebackend.repository.*;
import me.hys.carematebackend.infra.TelephonyClient;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminOnboardingService {

    private final CareMateRepository careRepo;
    private final AdminPhoneOtpRepository otpRepo;
    private final CareMateAdminRepository adminRepo;
    private final PasswordEncoder bcrypt;
    private final TelephonyClient tel;
    private static final SecureRandom RNG = new SecureRandom();

    @Transactional
    public String requestCode(Authentication auth, Long careMateId) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        if (adminRepo.existsByUserIdAndCareMateId(userId, careMateId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 관리자입니다.");

        CareMate cm = careRepo.findById(careMateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "시설 없음"));

        String dest = cm.getLocTelNo1() + "-" + cm.getLocTelNo2() + "-" + cm.getLocTelNo3();
        String code = genOtp(6);
        String codeHash = bcrypt.encode(code);
        Instant expires = Instant.now().plusSeconds(600);

        otpRepo.saveOrUpdate(userId, careMateId, dest, codeHash, expires);
        tel.sendTtsOrSms(dest, "인증번호 " + code + " 입니다. 10분 내에 입력해주세요.");

        return mask(dest);
    }

    @Transactional
    public void verify(Authentication auth, Long careMateId, String code) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        AdminPhoneOtp otp = otpRepo.findActive(userId, careMateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 없음/만료"));

        if (otp.getExpiresAt().isBefore(Instant.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인증코드 만료");

        if (!bcrypt.matches(code, otp.getCodeHash())) {
            if (otp.getAttempts() >= 5) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "시도 횟수 초과");
            }
            otp.incAttempts();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증코드 불일치");
        }

        //성공 처리
        otp.markVerified();

        int rows = adminRepo.insertIgnore(userId, careMateId);
    }

    private static String genOtp(int digits) {
        int bound = (int) Math.pow(10, digits);
        int v = RNG.nextInt(bound);
        return String.format("%0" + digits + "d", v);
    }

    private static String normalizePhone(String a, String b, String c) {
        if (isBlank(a) || isBlank(b) || isBlank(c)) return null;
        String phone = (a + "-" + b + "-" + c).replaceAll("[^0-9-]", "");
        // 기본 형태 검증(대충 2~3-2~4-3~4 자리)
        if (!phone.matches("\\d{2,3}-\\d{2,4}-\\d{3,4}")) return null;
        return phone;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String mask(String phone) {
        // 02-980-3004 -> 02-980-3***
        return phone.replaceAll("(\\d{2,3}-\\d{2,4}-)\\d{2}(\\d+)", "$1***");
    }
}
