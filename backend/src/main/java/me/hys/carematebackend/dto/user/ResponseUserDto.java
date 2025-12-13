package me.hys.carematebackend.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import me.hys.carematebackend.model.User;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseUserDto {
    private Long id;
    private String username;
    private String nickname;
    /** 👇 프런트 환영문구용 */
    private String name;

    /** 👇 이 유저가 관리자인 CareMate(시설) ID, 이름 목록 */
    private List<FacilityInfo> adminFacilities;

    @Getter
    @AllArgsConstructor
    public static class FacilityInfo {
        private String instCode;
        private String kindCode;
        private String name;
    }

    public static ResponseUserDto of(User user, List<FacilityInfo> adminFacilities) {
        return ResponseUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .name(user.getName())
                .adminFacilities(adminFacilities)
                .build();
    }
}
