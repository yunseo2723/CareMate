package me.hys.carematebackend.ltc;

import lombok.Builder;
import lombok.Data;
import me.hys.carematebackend.model.LtcFacility;

@Data
@Builder
public class FacilityLiteRes {
    private String instCode;
    private String kindCode;
    private String name;
    private String roadCode;
    private String fullRoadAddr;
    private Double lat;
    private Double lng;
    private String postNo;
    private String phone;
    private String grade;

    public static FacilityLiteRes from(LtcFacility f) {
        return FacilityLiteRes.builder()
                .instCode(f.getInstCode())
                .kindCode(f.getKindCode())
                .name(f.getName())
                .roadCode(f.getRoadNmCd())
                .fullRoadAddr(f.getFullRoadNm())
                .lat(f.getLat())
                .lng(f.getLng())
                .postNo(f.getPostNo())
                .phone(f.getPhone())
                .grade(f.getGrade())
                .build();
    }
}
