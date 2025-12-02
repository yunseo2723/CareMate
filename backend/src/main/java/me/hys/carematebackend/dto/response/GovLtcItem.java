package me.hys.carematebackend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GovLtcItem {

    @JsonProperty("longTermAdminSym")
    private String instCode;

    @JsonProperty("adminNm")
    private String name;

    @JsonProperty("adminPttnCd")
    private String kindCode;

    @JsonProperty("siDoCd")
    private String siDoCd;

    @JsonProperty("siGunGuCd")
    private String siGunGuCd;

    @JsonProperty("hmPostNo")
    private String postNo;
}
