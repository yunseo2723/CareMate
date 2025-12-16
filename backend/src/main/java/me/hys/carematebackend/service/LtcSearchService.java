package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.LtcFacilitySearchDto;
import me.hys.carematebackend.dto.ltc.NonBenefitDto;
import me.hys.carematebackend.repository.LtcFacilityRepository;
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
}
