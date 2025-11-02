package me.hys.carematebackend.dto.ltc.items;
import lombok.Data;

@Data
public class GeneralItem {
    private String longTermAdminSym; // 장기요양기관기호
    private String adminPttnCd;      // 기관유형코드
    private String adminNm;          // 기관이름
    private String hmPostNo;         // 행망우편번호
    private String detailAddr;       // 상세주소
    private String locTelNo1;        // 전화-지역
    private String locTelNo2;        // 전화-국번
    private String locTelNo3;        // 전화-번호
    private String longTermPeribRgtDt;// 지정일
}
