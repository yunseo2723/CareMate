package me.hys.carematebackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.email.EmailCheckDto;
import me.hys.carematebackend.dto.email.EmailRequestDto;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    /** 인증번호 전송 */
    @PostMapping("/signup/email")
    public ResponseEntity<ResponseDTO<?>> sendEmail(@RequestBody @Valid EmailRequestDto dto) {
        emailService.sendEmailCode(dto.getEmail());
        return ResponseEntity
                .status(ResponseCode.SUCCESS_EMAIL_SEND.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_EMAIL_SEND, null));
    }

    /** 인증번호 확인 */
    @PostMapping("/signup/emailAuth")
    public ResponseEntity<ResponseDTO<?>> checkAuthNum(@RequestBody @Valid EmailCheckDto dto) {
        emailService.verifyCode(dto.getEmail(), dto.getAuthNum());
        return ResponseEntity
                .status(ResponseCode.SUCCESS_EMAIL_ACCEPT.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_EMAIL_ACCEPT, null));
    }
}
