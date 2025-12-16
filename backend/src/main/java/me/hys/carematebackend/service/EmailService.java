package me.hys.carematebackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.exception.CodeExpiredException;
import me.hys.carematebackend.exception.UnverifiedCodeException;
import me.hys.carematebackend.model.EmailVerification;
import me.hys.carematebackend.repository.EmailVerificationRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailVerificationRepository verifyRepo;

    private static final Duration TTL = Duration.ofMinutes(3);

    /** 인증번호 전송 **/
    public void sendEmailCode(String email) {

        String code = String.format("%06d",
                ThreadLocalRandom.current().nextInt(0, 1_000_000));

        // DB에 upsert
        verifyRepo.findByEmail(email).ifPresentOrElse(
                ev -> {   // 있으면 갱신
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

        // 메일 발송
        try {
            MimeMessage message = mailSender.createMimeMessage();

            // true → multipart/alternative 로 만들 수 있음
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "utf-8");

            /* 1) From: Gmail 계정과 동일 + 서비스명 라벨 */
            helper.setFrom("hayunseo14@gmail.com", "Care Mate");   // ★ 추가

            /* 2) To */
            helper.setTo(email);

            /* 3) Subject */
            helper.setSubject("[Care Mate] 인증번호 발송");

            /* 4) 본문 – HTML & Plain 동시 전송 */
            String plain = """
                    CareMate 인증 코드
                    %s
                    3분 이내에 인증코드를 입력해 주세요.
                    """.formatted(code);

            String html = """
                    <h2> CareMate 인증 코드 </h2>
                    <h2 style="letter-spacing:6px;">%s</h2>
                    <b>3분 이내에 인증코드를 입력해 주세요.</b>
                    """.formatted(code);

            helper.setText(plain, html);   // (plain, html) 순서

            /* 5) 전송 */
            mailSender.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new IllegalStateException("메일 전송 실패", e);
        }
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
