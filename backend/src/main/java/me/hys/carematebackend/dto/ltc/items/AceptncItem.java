package me.hys.carematebackend.dto.ltc.items;
import lombok.Data;

@Data
public class AceptncItem {
    private Integer totPer;   // 정원
    private Integer maNowPer; // 현원 남
    private Integer fmNowPer; // 현원 여
    private Integer maRsvPer; // 대기 남
    private Integer fmRsvPer; // 대기 여
}
