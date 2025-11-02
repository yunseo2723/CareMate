package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class StaffDto {
    private Integer socWel;         // 사회복지사
    private Integer chrgDoc;        // 의사_전임
    private Integer nur;            // 간호사
    private Integer nurArticle;     // 간호조무사
    private Integer dent;           // 치위생사
    private Integer physicalMTret;  // 물리치료사
    private Integer wrkMTret;       // 작업치료사
    private Integer recuProt_1;      // 요양보호사1급
    private Integer nut;            // 영양사
    private Integer cook;           // 조리원
    private Integer mgmtPrsn;       // 관리인
    private Integer suppPrsn;       // 보조원
    private Integer etcPer;       // 기타인원
}
