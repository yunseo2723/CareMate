package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import me.hys.carematebackend.model.LtcFacility;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    private Integer caregiver;   //요양복지사
    private Integer doctor;      //의사
    private Integer nurse;       //간호사
    private Integer socialWorker;//사회복지사
    private Integer singleRm;
    private Integer doubleRm;
    private Integer tripleRm;
    private Integer quadrupleRm;
    private Integer programRoom;
    private Integer diningKitchen;
    private Integer bath;

    private List<Map<String, Object>> programs;

    public static FacilityLiteRes from(LtcFacility f) {
        List<Map<String, Object>> programs = new ArrayList<>();

        if (f.getProgramsJson() != null && !f.getProgramsJson().isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                programs = mapper.readValue(
                        f.getProgramsJson(),
                        new TypeReference<List<Map<String, Object>>>() {}
                );
            } catch (Exception ignored) {}
        }

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
                .caregiver(f.getCaregiver())
                .doctor(f.getDoctor())
                .nurse(f.getNurse())
                .socialWorker(f.getSocialWorker())
                .singleRm(f.getSingleRm())
                .doubleRm(f.getDoubleRm())
                .tripleRm(f.getTripleRm())
                .quadrupleRm(f.getQuadrupleRm())
                .programRoom(f.getProgramRoom())
                .diningKitchen(f.getDiningKitchen())
                .bath(f.getBath())
                .programs(programs)   // ← JSON 그대로 삽입
                .build();
    }
}
