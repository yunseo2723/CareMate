package me.hys.carematebackend.infra;

public interface TelephonyClient {
    void sendTtsOrSms(String destPhone, String message);
}
