package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class ContractDto {
    private String yoyangNm;         // 협약기관명
    private String adptFrDt;        // 협약기간_시작날짜
    private String adptToDt;            // 협약기간_끝날짜

}
