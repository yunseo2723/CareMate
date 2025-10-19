package me.hys.carematebackend.dto.facility;

public record FacilitySummaryDto(
        String id, String name, String type, String sido, String sgg,
        Integer capacityTotal, Integer residentMale, Integer residentFemale,
        Double lat, Double lon
) {}