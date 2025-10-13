package me.hys.carematebackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import me.hys.carematebackend.model.User;

@Builder
@Getter
@AllArgsConstructor
public class ResponseUserDto {
    private Long id;
    private String username;
    private String nickname;

    public static ResponseUserDto entityToDto(User user) {
        return ResponseUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .build();
    }
}
