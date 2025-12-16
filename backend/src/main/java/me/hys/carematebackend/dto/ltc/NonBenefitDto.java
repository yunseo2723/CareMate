package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class NonBenefitDto {
    private String nonpayKind;  // 비급여 항목 종류
    private String prodBase;    // 산출 근거
    private String nonpayTgtAmt;  // 비급여 항목 금액
    private String uptDt;   // 등록일
}
