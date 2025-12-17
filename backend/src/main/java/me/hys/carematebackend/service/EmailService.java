package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.exception.CodeExpiredException;
import me.hys.carematebackend.exception.UnverifiedCodeException;
import me.hys.carematebackend.mail.MailSenderPort;
import me.hys.carematebackend.model.EmailVerification;
import me.hys.carematebackend.repository.EmailVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailService {

    private final MailSenderPort mailSender;
    private final EmailVerificationRepository verifyRepo;

    private static final Duration TTL = Duration.ofMinutes(3);

    /** 인증번호 전송 **/
    public void sendEmailCode(String email) {

        String code = String.format("%06d",
                ThreadLocalRandom.current().nextInt(0, 1_000_000));

        // DB upsert
        verifyRepo.findByEmail(email).ifPresentOrElse(
                ev -> {
                    ev.setCode(code);
                    ev.setExpiry(LocalDateTime.now().plus(TTL));
                    ev.setVerified(false);
                },
                () -> verifyRepo.save(EmailVerification.builder()
                        .email(email)
                        .code(code)
                        .expiry(LocalDateTime.now().plus(TTL))
                        .verified(false)
                        .build())
        );

        String subject = "[Care Mate] 인증번호 발송";

        String plain = """
                CareMate 인증 코드
                %s
                3분 이내에 인증코드를 입력해 주세요.
                """.formatted(code);

        String html = """
                <h2>CareMate 인증 코드</h2>
                <h2 style="letter-spacing:6px;">%s</h2>
                <b>3분 이내에 인증코드를 입력해 주세요.</b>
                """.formatted(code);

        // ⭐ 여기 한 줄만 남김
        mailSender.send(email, subject, plain, html);
    }

    /** 인증번호 확인 **/
    public void verifyCode(String email, String inputCode) {
        EmailVerification ev = verifyRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("코드 발급 기록이 없습니다."));

        if (ev.getExpiry().isBefore(LocalDateTime.now()))
            throw new CodeExpiredException("인증번호가 만료되었습니다.");

        if (!ev.getCode().equals(inputCode))
            throw new UnverifiedCodeException("인증번호가 일치하지 않습니다.");

        ev.setVerified(true);
    }
}
