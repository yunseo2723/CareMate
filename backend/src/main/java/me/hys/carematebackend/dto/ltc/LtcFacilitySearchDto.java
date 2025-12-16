package me.hys.carematebackend.dto.ltc;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import me.hys.carematebackend.model.LtcFacility;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
public class LtcFacilitySearchDto {

    private String instCode;
    private String kindCode;
    private String name;
    private String fullRoadAddr;
    private List<NonBenefitDto> nonBenefits;

    public static LtcFacilitySearchDto from(LtcFacility f, List<NonBenefitDto> nonBenefits) {
        return LtcFacilitySearchDto.builder()
                .instCode(f.getInstCode())
                .kindCode(f.getKindCode())
                .name(f.getName())
                .fullRoadAddr(f.getFullRoadNm())
                .nonBenefits(nonBenefits)
                .build();
    }
}

