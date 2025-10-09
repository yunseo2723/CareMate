package me.hys.carematebackend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import jakarta.mail.internet.MimeMessage;

@Configuration
public class NoopMailConfig {

    /**
     * Render(스테이징 등) 환경에서 app.mail.enabled=false일 때
     * 실제 메일을 보내지 않고 그냥 "성공"처럼 동작하는 가짜 MailSender 등록
     */
    @Bean
    @ConditionalOnProperty(value = "app.mail.enabled", havingValue = "false")
    public JavaMailSender noopMailSender() {
        return new JavaMailSenderImpl() {
            @Override public void send(MimeMessage mimeMessage) { /* no-op */ }
            @Override public void send(MimeMessage... mimeMessages) { }
            @Override public void send(SimpleMailMessage simpleMessage) { }
            @Override public void send(SimpleMailMessage... simpleMessages) { }
        };
    }
}
