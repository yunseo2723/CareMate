package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.user.RegisterUserDto;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.exception.DuplicateLoginIdException;
import me.hys.carematebackend.exception.UnauthenticatedEmailException;
import me.hys.carematebackend.exception.UserNotExistException;
import me.hys.carematebackend.model.EmailVerification;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.EmailVerificationRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailVerificationRepository verifyRepo;

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

    public List<ResponseUserDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(ResponseUserDto::entityToDto)
                .toList();
    }

    public void deleteById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotExistException("존재하지 않는 유저입니다."));
        userRepository.delete(user);
    }
}
