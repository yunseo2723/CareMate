package me.hys.carematebackend.controller;

import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.email.EmailCheckDto;
import me.hys.carematebackend.dto.email.EmailRequestDto;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ResponseDTO<?>> sendPolice(@RequestBody @Valid EmailRequestDto dto) {
        emailService.sendPoliceCode(dto.getEmail());
        return ResponseEntity
                .status(ResponseCode.SUCCESS_EMAIL_POLICE_SEND.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_EMAIL_POLICE_SEND, null));
    }

    /** 인증번호 확인 */
    @PostMapping("/signup/emailAuth")
    public ResponseEntity<ResponseDTO<?>> checkPolice(@RequestBody @Valid EmailCheckDto dto) {
        emailService.verifyCode(dto.getEmail(), dto.getAuthNum());
        return ResponseEntity
                .status(ResponseCode.SUCCESS_EMAIL_POLICE_ACCEPT.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_EMAIL_POLICE_ACCEPT, null));
    }
}
