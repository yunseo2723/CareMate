package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class FacilitySummaryDto {
    private String instCode;   // longTermAdminSym
    private String kindCode;   // adminPttnCd
    private String name;       // insttNm
    private String address;    // e.g., "경기도 과천시 ..."
    private String phone;        // 지역-국번-번호 합침
}