package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.ContractDto;
import me.hys.carematebackend.dto.ltc.FacilityDetailRes;
import me.hys.carematebackend.dto.ltc.NonBenefitDto;
import me.hys.carematebackend.dto.ltc.ProgramDto;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcDetailDbService {

    private final LtcFacilityRepository repo;
    private final ObjectMapper om = new ObjectMapper();

    public FacilityDetailRes getDetail(String instCode, String kindCode) {

        LtcFacility f = repo.findByInstCodeAndKindCode(instCode, kindCode)
                .orElseThrow(() -> new RuntimeException("시설을 찾을 수 없음"));

        List<ProgramDto> programs = List.of();
        List<ContractDto> contracts = List.of();
        List<NonBenefitDto> nonBenefits = List.of();

        try {
            if (f.getProgramsJson() != null) {
                programs = om.readValue(
                        f.getProgramsJson(),
                        om.getTypeFactory().constructCollectionType(List.class, ProgramDto.class)
                );
            }
            if (f.getContractsJson() != null) {
                contracts = om.readValue(
                        f.getContractsJson(),
                        om.getTypeFactory().constructCollectionType(List.class, ContractDto.class)
                );
            }
            if (f.getNonbenefitJson() != null) {
                nonBenefits = om.readValue(
                        f.getNonbenefitJson(),
                        om.getTypeFactory().constructCollectionType(List.class, NonBenefitDto.class)
                );
            }
        } catch (Exception e) {
            // JSON 파싱 실패해도 API는 죽지 않게 처리
            e.printStackTrace();
        }

        return FacilityDetailRes.from(f, programs, contracts, nonBenefits);
    }
}