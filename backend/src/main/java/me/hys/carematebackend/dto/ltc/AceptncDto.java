package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class AceptncDto {
    private Integer totPer;   // 정원
    private Integer maNowPer; // 현원_남
    private Integer fmNowPer; // 현원_여
    private Integer maRsvPer; // 대기_남
    private Integer fmRsvPer; // 대기_여
}
