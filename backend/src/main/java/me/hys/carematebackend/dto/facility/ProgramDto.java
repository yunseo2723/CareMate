package me.hys.carematebackend.dto.facility;

public record ProgramDto(
        Integer programTypeCode, String programTypeName, String programName,
        Integer programTargetCount, String programCycleText, String programPlace
) {}