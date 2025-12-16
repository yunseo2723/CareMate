package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class GeneralDto {

    private String longTermAdminSym;   // 기관기호
    private String adminPttnCd;        // 기관유형코드
    private String roadNmCd;           // 도로명코드
    private String adminNm;            // 기관이름
    private String hmPostNo;           // 행망우편번호
    private String locTelNo_1;           // 010-
    private String locTelNo_2;           // 1234-
    private String locTelNo_3;           // 5678-
    private String fullTel;
    private String gunmulMlno;    //건물본번
    private String gunmulSlno;    //건물부번
    private String fl;            //층수
    private String longTermPeribRgtDt; // 지정일

    public String getFullTel() {
        if (locTelNo_1 == null || locTelNo_1.isBlank()) return null;

        String p2 = (locTelNo_2 != null ? locTelNo_2 : "");
        String p3 = (locTelNo_3 != null ? locTelNo_3 : "");

        return locTelNo_1 + "-" + p2 + "-" + p3;
    }
}
