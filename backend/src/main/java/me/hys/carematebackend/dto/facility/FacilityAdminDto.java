package me.hys.carematebackend.dto.facility;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FacilityAdminDto {
    private Long userId;
    private String name;
    private String nickname;
    private String email;
}
