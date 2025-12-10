package me.hys.carematebackend.dto.admin;

import lombok.Data;

@Data
public class AdminVerifyRequest {
    private String facilityName;
    private String facilityAddress;
}