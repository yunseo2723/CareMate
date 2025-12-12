package me.hys.carematebackend.dto.facility;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FacilityInfoDto {

    private String instCode;
    private String name;
    private String address;
    private String phone;

    private List<FacilityAdminDto> admins; // 관리자 목록
}
