package me.hys.carematebackend.dto.ltc.items;
import lombok.Data;

@Data
public class ProgramItem {
    private String pgmType;  // 종류
    private String pgmNm;    // 제목
    private String tgtNop;   // 대상
    private String cyclTm;   // 주기
    private String runPlc;   // 장소
}
