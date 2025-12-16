package me.hys.carematebackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.dto.user.*;
import me.hys.carematebackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Validated
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<?>> registerUser(@Valid @RequestBody RegisterUserDto registerUserDto) {
        userService.registerUser(registerUserDto);
        return ResponseEntity
                .status(ResponseCode.SUCCESS_REGISTER.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_REGISTER, null));
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<ResponseUserDto>>> getAllUsers() {
        List<ResponseUserDto> users = userService.findAll();
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_RETRIEVE_USER, users));
    }

     /** 로그인된 현재 정보 불러오기 **/
    @GetMapping("/me")
    public ResponseEntity<ResponseDTO<ResponseUserDto>> getMyUserInfo(@AuthenticationPrincipal CustomUserDetails cud) {
        Long userId = cud.getUser().getId(); // 또는 cud.getUserId()
        ResponseUserDto dto = userService.getMe(userId);
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_RETRIEVE_USER, dto));
    }

    /** 내 프로필 수정 **/
    @PatchMapping("/me/profile")
    public ResponseEntity<ResponseDTO<ResponseUserDto>> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails cud,
            @Valid @RequestBody ProfileUpdateDto req
    ) {
        Long userId = cud.getUser().getId();
        ResponseUserDto dto = userService.updateProfile(userId, req);
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_UPDATE_USER, dto));
    }

    /** 비밀번호 변경 **/
    @PatchMapping("/me/password")
    public ResponseEntity<ResponseDTO<?>> changeMyPassword(
            @AuthenticationPrincipal CustomUserDetails cud,
            @Valid @RequestBody PasswordChangeDto req
    ) {
        Long userId = cud.getUser().getId();
        userService.changePassword(userId, req);
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_UPDATE_USER, null));
    }

     /** id 기반 회원 삭제 **/
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<?>> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_DELETE_USER, null));
    }
}