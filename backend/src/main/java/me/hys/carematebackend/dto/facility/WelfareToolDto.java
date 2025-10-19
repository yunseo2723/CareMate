package me.hys.carematebackend.dto.facility;

public record WelfareToolDto(
        String welfareReportCode, String welfareReportName,
        String toolName, String toolManufacturer, String toolModel, String toolUsage, String toolRemark
) {}