package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.user.PasswordChangeDto;
import me.hys.carematebackend.dto.user.ProfileUpdateDto;
import me.hys.carematebackend.dto.user.RegisterUserDto;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.exception.DuplicateLoginIdException;
import me.hys.carematebackend.exception.UnauthenticatedEmailException;
import me.hys.carematebackend.exception.UserNotExistException;
import me.hys.carematebackend.model.EmailVerification;
import me.hys.carematebackend.model.FacilityAdmin;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.EmailVerificationRepository;
import me.hys.carematebackend.repository.FacilityAdminRepository;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailVerificationRepository verifyRepo;
    private final FacilityAdminRepository facilityAdminRepository;
    private final LtcFacilityRepository ltcFacilityRepository;

    // 유저 등록
    public void registerUser(RegisterUserDto registerUserDto) {
        String username = registerUserDto.getUsername();

        // 1) 이메일 인증 여부 체크
        EmailVerification ev = verifyRepo.findByEmail(username)
                .orElseThrow(() -> new UnauthenticatedEmailException("이메일 인증을 먼저 해주세요."));
        // 코드 일치ㆍ만료 확인 → 통과 못 하면 예외 발생

        if (!ev.isVerified())
            throw new IllegalArgumentException("이메일 인증이 아직 완료되지 않았습니다.");

        // 2) 중복 ID 검사
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateLoginIdException("중복된 아이디로는 가입할 수 없습니다.");
        }

        // 3) 회원 저장
        User user = User.signupBuilder()
                .username(username)
                .password(bCryptPasswordEncoder.encode(registerUserDto.getPassword()))
                .nickname(registerUserDto.getNickname())
                .name(registerUserDto.getName())
                .build();

        userRepository.save(user);

        /* 4) 인증 기록 삭제 (한 번 소모) */
        verifyRepo.delete(ev);
    }

    // 1) 내 정보 조회 (/users/me)
    @Transactional(readOnly = true)
    public ResponseUserDto getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotExistException("존재하지 않는 유저입니다."));
        // 1) 유저가 관리 중인 instCode 목록
        List<String> adminInstCodes =
                facilityAdminRepository.findByUserId(user.getId())
                        .stream()
                        .map(FacilityAdmin::getInstCode)
                        .toList();

        // 2) instCode 기반 시설 이름 조회
        List<ResponseUserDto.FacilityInfo> adminFacilities = adminInstCodes.stream()
                .map(instCode -> {
                    var fac = ltcFacilityRepository.findByInstCode(instCode).orElse(null);

                    String name = (fac != null ? fac.getName() : "(이름 없음)");
                    String kindCode = (fac != null ? fac.getKindCode() : "(코드 없음)");
                    return new ResponseUserDto.FacilityInfo(instCode, kindCode, name);
                })
                .toList();

        return ResponseUserDto.of(user, adminFacilities);
    }

    // 2) 프로필 수정 (닉네임/이름/연락처 등)
    @Transactional
    public ResponseUserDto updateProfile(Long userId, ProfileUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotExistException("존재하지 않는 유저입니다."));

        // username(이메일)은 수정불가 가정
        if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
            user.setNickname(dto.getNickname().trim());
        }
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        // phone 같은 필드를 User 엔티티에 추가했다면 여기서 setPhone(dto.getPhone()) 해주면 됨

        // 현재 유저의 관리자 시설 목록 가져오기
        List<String> instCodes = facilityAdminRepository.findByUserId(user.getId())
                .stream()
                .map(FacilityAdmin::getInstCode)
                .toList();

        // instCode → 시설 이름 변환
        List<ResponseUserDto.FacilityInfo> facilities =
                instCodes.stream()
                        .map(instCode -> {
                            var fac = ltcFacilityRepository.findByInstCode(instCode).orElse(null);
                            return new ResponseUserDto.FacilityInfo(
                                    instCode,
                                    fac != null ? fac.getKindCode() : "(코드 없음)",
                                    fac != null ? fac.getName() : "(이름 없음)"
                            );
                        })
                        .toList();

        return ResponseUserDto.of(user, facilities);
    }

    // ✅ 3) 비밀번호 변경
    @Transactional
    public void changePassword(Long userId, PasswordChangeDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotExistException("존재하지 않는 유저입니다."));

        // 현재 비밀번호 검증 (원하면 스킵 가능)
        if (!bCryptPasswordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        if (dto.getNewPassword() == null || dto.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("새 비밀번호는 6자 이상이어야 합니다.");
        }

        user.setPassword(bCryptPasswordEncoder.encode(dto.getNewPassword()));
    }

    public List<ResponseUserDto> findAll() {
        return userRepository.findAll().stream()
                // 전체 목록이면 굳이 admin 목록까지 붙일 필요 없으면 빈 리스트로
                .map(u -> ResponseUserDto.of(u, List.of()))
                .toList();
    }

    public void deleteById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotExistException("존재하지 않는 유저입니다."));
        userRepository.delete(user);
    }
}
