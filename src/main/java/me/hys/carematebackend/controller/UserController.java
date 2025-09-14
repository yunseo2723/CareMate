package me.hys.carematebackend.controller;

import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.dto.user.AllUserDto;
import me.hys.carematebackend.dto.user.RegisterUserDto;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Validated
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ResponseDTO<AllUserDto>> getAllUsers() {
        AllUserDto dto = userService.findAllGrouped();
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_RETRIEVE_USER, dto));
    }

    /**
     * 로그인된 현재 정보 불러오기
     */
    @GetMapping("/me")
    public ResponseEntity<ResponseDTO<?>> getMyUserInfo(Authentication authentication) {
        User user = (User) authentication.getPrincipal();  // ✅ 직접 User 객체로 캐스팅
        ResponseUserDto dto = userService.getUsernameAndNickname(user.getUsername());  // 또는 user 객체 바로 전달
        return ResponseEntity
                .status(ResponseCode.SUCCESS_RETRIEVE_USER.getStatus().value())
                .body(new ResponseDTO<>(ResponseCode.SUCCESS_RETRIEVE_USER, dto));
    }

    /**
     * id 기반 회원 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<?>> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok(new ResponseDTO<>(ResponseCode.SUCCESS_DELETE_USER, null));
    }
}
