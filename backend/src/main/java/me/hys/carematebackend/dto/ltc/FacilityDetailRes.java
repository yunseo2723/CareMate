package me.hys.carematebackend.dto.ltc;

import lombok.Builder;
import lombok.Data;
import me.hys.carematebackend.model.LtcFacility;

import java.util.List;

@Data
@Builder
public class FacilityDetailRes {

    private String instCode;
    private String kindCode;
    private String name;
    private String roadCode;      // DB 원값
    private String fullRoadAddr;  // 변환된 전체 주소
    private String lat;
    private String lng;
    private String postNo;
    private String phone;

    private String grade;
    private Float totalScore;
    private Float opScore;
    private Float safetyScore;
    private Float rightsScore;
    private Float processScore;
    private Float resultScore;

    private Integer capacityTotal;
    private Integer residentMale;
    private Integer residentFemale;

    private Integer nurse;
    private Integer doctor;
    private Integer caregiver;
    private Integer socialWorker;
    private Integer nurseAide;
    private Integer physicalTher;
    private Integer occupTher;
    private Integer nutritionist;
    private Integer cook;
    private Integer manager;
    private Integer assistant;

    private Integer singleRm;
    private Integer doubleRm;
    private Integer tripleRm;
    private Integer quadrupleRm;
    private Integer specialRm;

    private Integer adlTraining;
    private Integer programRoom;
    private Integer diningKitchen;
    private Integer toilet;
    private Integer bath;
    private Integer laundry;

    private String homepage;
    private String transport;
    private String parking;

    private List<ProgramDto> programs;
    private List<ContractDto> contracts;
    private List<NonBenefitDto> nonBenefits;

    public static FacilityDetailRes from(LtcFacility f,
                                         List<ProgramDto> programs,
                                         List<ContractDto> contracts,
                                         List<NonBenefitDto> nonBenefits) {

        return FacilityDetailRes.builder()
                .instCode(f.getInstCode())
                .kindCode(f.getKindCode())
                .name(f.getName())
                .roadCode(f.getRoadNmCd())
                .fullRoadAddr(f.getFullRoadNm())
                .lat(f.getLat() != null ? f.getLat().toString() : null)
                .lng(f.getLng() != null ? f.getLng().toString() : null)
                .postNo(f.getPostNo())
                .phone(f.getPhone())

                .grade(f.getGrade())
                .totalScore(f.getTotalScore())
                .opScore(f.getOpScore())
                .safetyScore(f.getSafetyScore())
                .rightsScore(f.getRightsScore())
                .processScore(f.getProcessScore())
                .resultScore(f.getResultScore())

                .capacityTotal(f.getCapacityTotal())
                .residentMale(f.getResidentMale())
                .residentFemale(f.getResidentFemale())

                .nurse(f.getNurse())
                .doctor(f.getDoctor())
                .caregiver(f.getCaregiver())
                .socialWorker(f.getSocialWorker())
                .nurseAide(f.getNurseAide())
                .physicalTher(f.getPhysicalTher())
                .occupTher(f.getOccupTher())
                .nutritionist(f.getNutritionist())
                .cook(f.getCook())
                .manager(f.getManager())
                .assistant(f.getAssistant())

                .singleRm(f.getSingleRm())
                .doubleRm(f.getDoubleRm())
                .tripleRm(f.getTripleRm())
                .quadrupleRm(f.getQuadrupleRm())
                .specialRm(f.getSpecialRm())

                .adlTraining(f.getAdlTraining())
                .programRoom(f.getProgramRoom())
                .diningKitchen(f.getDiningKitchen())
                .toilet(f.getToilet())
                .bath(f.getBath())
                .laundry(f.getLaundry())

                .homepage(f.getHomepage())
                .transport(f.getTransport())
                .parking(f.getParking())

                .programs(programs)
                .contracts(contracts)
                .nonBenefits(nonBenefits)

                .build();
    }
}
