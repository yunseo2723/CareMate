package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.FacilityLiteRes;
import me.hys.carematebackend.dto.ltc.LtcFacilitySearchDto;
import me.hys.carematebackend.dto.ltc.NonBenefitDto;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcSearchService {

    private final LtcFacilityRepository repo;
    private final ObjectMapper objectMapper;

    public List<LtcFacilitySearchDto> search(String name) {

        if (name == null || name.trim().isEmpty()) {
            return List.of();
        }

        return repo
                .findTop10ByNameContainingIgnoreCaseOrderByNameAsc(name.trim())
                .stream()
                .map(f -> {

                    List<NonBenefitDto> nonBenefits = List.of();

                    try {
                        if (f.getNonbenefitJson() != null && !f.getNonbenefitJson().isBlank()) {
                            nonBenefits = objectMapper.readValue(
                                    f.getNonbenefitJson(),
                                    objectMapper.getTypeFactory()
                                            .constructCollectionType(List.class, NonBenefitDto.class)
                            );
                        }
                    } catch (Exception e) {
                        System.err.println("비급여 JSON 파싱 실패: " + f.getInstCode());
                    }

                    return LtcFacilitySearchDto.from(f, nonBenefits);
                })
                .toList();
    }

    public List<FacilityLiteRes> findLiteInRadius(
            double centerLat,
            double centerLng,
            double radiusKm,
            int limit
    ) {
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(centerLat)));

        double minLat = centerLat - latDelta;
        double maxLat = centerLat + latDelta;
        double minLng = centerLng - lngDelta;
        double maxLng = centerLng + lngDelta;

        return repo.findInBounds(
                        minLat, maxLat, minLng, maxLng,
                        PageRequest.of(0, limit)
                ).stream()
                .filter(f ->
                        haversine(
                                centerLat, centerLng,
                                f.getLat(), f.getLng()
                        ) <= radiusKm
                )
                .map(FacilityLiteRes::from)   // ⭐ 핵심
                .toList();
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

}
