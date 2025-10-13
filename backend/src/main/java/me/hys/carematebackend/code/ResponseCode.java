package me.hys.carematebackend.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

// 프론트에서 받는 응답을 일정하게 유지해주기 위해
// 간단히 우리만의 알아들을 수 있는 설명과 성공 코드를 전달합니다.
// 우리 프로젝트에 맞는 성공 메시지를 전달하게 됨.

@RequiredArgsConstructor
@Getter

public enum ResponseCode {
    SUCCESS_REGISTER(HttpStatus.OK, "회원가입을 성공했습니다."),
    SUCCESS_LOGIN(HttpStatus.OK, "로그인을 성공했습니다. 헤더 토큰을 확인하세요."),
    SUCCESS_RETRIEVE_USER(HttpStatus.OK, "유저 정보를 성공적으로 조회했습니다."),
    SUCCESS_DELETE_USER(HttpStatus.OK, "유저가 성공적으로 삭제되었습니다."),
    SUCCESS_UPDATE_USER(HttpStatus.OK, "유저 정보를 성공적으로 수정했습니다."),
    SUCCESS_RETRIEVE_ALL_USERS(HttpStatus.OK, "모든 사용자를 성공적으로 조회했습니다."),
    SUCCESS_POLICE_LOGOUT(HttpStatus.OK, "성공적으로 로그아웃했습니다."),
    SUCCESS_EMAIL_SEND(HttpStatus.OK, "인증번호를 전송했습니다."),
    SUCCESS_EMAIL_ACCEPT(HttpStatus.OK, "이메일 인증을 성공했습니다.");

    private final HttpStatus status;
    private final String message;

}
