package me.hys.carematebackend.dto.caremate;

import java.util.List;

public record CareMateCardRes(
        Long id, String name, String region,
        Integer monthlyFee, Double rating,
        Double distanceKm, List<String> tags, String thumbnailUrl
) {}
