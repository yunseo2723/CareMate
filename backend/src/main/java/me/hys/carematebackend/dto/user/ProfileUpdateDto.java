package me.hys.carematebackend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProfileUpdateDto {
    private String name;     // 선택: null이면 변경 안 함
    private String nickname; // 선택: null이면 변경 안 함
}