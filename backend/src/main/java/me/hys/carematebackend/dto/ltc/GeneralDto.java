package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class GeneralDto {
    private String longTermAdminSym;   // 기관기호
    private String adminPttnCd;
    private String adminNm;            // 기관이름
    private String hmPostNo;           // 행망우편번호
    private String detailAddr;         // 상세주소
    private String locTelNo;           // "02-123-4567"로 합친 전화
    private String longTermPeribRgtDt; // 지정일
}
