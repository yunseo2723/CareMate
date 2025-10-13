package me.hys.carematebackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.dto.user.RegisterUserDto;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.model.User;
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

    /**
     * 로그인된 현재 정보 불러오기
     */
    @GetMapping("/me")
    public ResponseUserDto getMyUserInfo(@AuthenticationPrincipal CustomUserDetails cud) {
        User user = cud.getUser();
        return ResponseUserDto.entityToDto(user);
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