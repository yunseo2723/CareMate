package me.hys.carematebackend.mail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@RequiredArgsConstructor
public class SmtpMailSender implements MailSenderPort {

    private final JavaMailSender javaMailSender;

    @Override
    public void send(String to, String subject, String plain, String html) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "utf-8");

            helper.setFrom("caremate.kro.kr", "Care Mate");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(plain, html);

            javaMailSender.send(message);

        } catch (Exception e) {
            throw new IllegalStateException("SMTP 메일 전송 실패", e);
        }
    }
}
