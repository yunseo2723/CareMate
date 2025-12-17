package me.hys.carematebackend.mail;

import com.resend.core.exception.ResendException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;

@Component
@Profile("prod")
public class ResendMailSender implements MailSenderPort {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    @Override
    public void send(String to, String subject, String plain, String html) {
        try {
            Resend resend = new Resend(apiKey);

            CreateEmailOptions request = CreateEmailOptions.builder()
                    .from(from)
                    .to(to)
                    .subject(subject)
                    .html(html)
                    .text(plain)
                    .build();

            resend.emails().send(request);

        } catch (ResendException e) {
            // 여기서 로그 남기고 런타임 예외로 전환
            throw new IllegalStateException("Resend 메일 전송 실패", e);
        }
    }
}
