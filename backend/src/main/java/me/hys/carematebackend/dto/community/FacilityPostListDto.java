package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FacilityPostListDto {

    private Long id;
    private String title;
    private String writerName;
    private String createdAt;  // 날짜 문자열
    private Long commentCount;
}
