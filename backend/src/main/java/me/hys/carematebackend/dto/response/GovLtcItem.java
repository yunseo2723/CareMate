package me.hys.carematebackend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GovLtcItem {

    @JsonProperty("longTermAdminSym")
    private String instCode;

    @JsonProperty("adminPttnCd")
    private String kindCode;
}
