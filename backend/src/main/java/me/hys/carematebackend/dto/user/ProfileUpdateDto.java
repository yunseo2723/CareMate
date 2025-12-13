package me.hys.carematebackend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProfileUpdateDto {
    private String name;
    private String nickname;
}