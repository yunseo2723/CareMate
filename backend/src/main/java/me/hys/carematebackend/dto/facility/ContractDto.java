package me.hys.carematebackend.dto.facility;

import java.time.LocalDate;
public record ContractDto(String contractOrgName, LocalDate contractStart, LocalDate contractEnd) {}