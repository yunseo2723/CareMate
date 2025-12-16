package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.FacilityAdminDto;
import me.hys.carematebackend.dto.facility.FacilityInfoDto;
import me.hys.carematebackend.model.FacilityAdmin;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.FacilityAdminRepository;
import me.hys.carematebackend.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityAdminService {

    private final FacilityRepository facilityRepository;
    private final FacilityAdminRepository facilityAdminRepository;

    public FacilityInfoDto getFacilityInfo(String instCode) {

        LtcFacility facility = facilityRepository.findById(instCode)
                .orElseThrow(() -> new RuntimeException("시설 정보를 찾을 수 없습니다."));

        List<FacilityAdmin> admins = facilityAdminRepository.findByInstCode(instCode);

        List<FacilityAdminDto> adminDtos = admins.stream()
                .map(a -> new FacilityAdminDto(
                        a.getUser().getId(),
                        a.getUser().getName(),
                        a.getUser().getNickname(),
                        a.getUser().getUsername()
                ))
                .toList();

        return new FacilityInfoDto(
                facility.getInstCode(),
                facility.getKindCode(),
                facility.getName(),
                facility.getFullRoadNm(),
                facility.getPhone(),
                adminDtos
        );
    }
}
