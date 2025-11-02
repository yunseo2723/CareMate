package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class ProgramDto {
    private String pgmType;  // 종류
    private String pgmNm;    // 제목
    private Integer tgtNop;  // 대상
    private String cyclTm;   // 주기
    private String runPlc;   // 장소
}
