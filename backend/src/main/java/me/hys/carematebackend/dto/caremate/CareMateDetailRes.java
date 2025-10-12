package me.hys.carematebackend.dto.caremate;

import java.util.List;
import java.util.Map;

public record CareMateDetailRes(
        Long id, String name, String region, String address, String phone,
        Map<String,Integer> monthlyFee,
        Double nurseRatio, Double rating,
        List<String> specialties, List<String> programs,
        List<String> photos, Double lat, Double lng
) {}
