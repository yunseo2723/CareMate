package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.hys.carematebackend.model.community.FacilityBoardType;

@Data
@AllArgsConstructor
public class FacilityPostListDto {

    private Long id;
    private String title;
    private FacilityBoardType boardType;
    private String writerName;
    private String createdAt;  // 날짜 문자열
    private Long commentCount;
}
