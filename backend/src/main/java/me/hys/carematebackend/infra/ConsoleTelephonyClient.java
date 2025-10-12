package me.hys.carematebackend.infra;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Primary
public class ConsoleTelephonyClient implements TelephonyClient {

    @Override
    public void sendTtsOrSms(String destPhone, String message) {
        // 실제 SMS/TTS 연동 대신 콘솔 출력 (데모/개발용)
        log.info("📞 [DEV TELEPHONY] to={} msg={}", destPhone, message);
        System.out.println("[DEV TELEPHONY] to=" + destPhone + " msg=" + message);
    }
}
