package me.hys.carematebackend.dto.facility;

import java.time.LocalDate;
public record NonpayDto(Integer nonpayKindCode, String nonpayKindName, Integer nonpayAmount, String nonpayBasis, LocalDate nonpayUptDt) {}