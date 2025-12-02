package me.hys.carematebackend.dto.ltc;

import lombok.Data;
import lombok.Setter;

import java.util.List;

@Setter
@Data
public class FacilityDetailDto {
    private String instCode;     // longTermAdminSym
    private String kindCode;     // adminPttnCd
    private String name;         // adminNm
    private String post;      // 우편번호
    private String phone;        // 지역-국번-번호 합침
    private String designatedAt; // longTermPeribRgtDt

    private Integer capacityTotal;   // totPer
    private Integer residentMale;    // maNowPer
    private Integer residentFemale;  // fmNowPer

    private Integer nurse;         // 간호사
    private Integer doctor;        // 의사(전임)
    private Integer caregiver;     // 요양보호사1급
    private Integer socialWorker;  // 사회복지사
    private Integer nurseAide;     // 간호조무사
    private Integer physicalTher;  // 물리치료사
    private Integer occupTher;     // 작업치료사
    private Integer nutritionist;  // 영양사
    private Integer cook;          // 조리원
    private Integer manager;       // 관리인
    private Integer assistant;     // 보조원
    private Integer etcPer;           // 기타(자동 합산용)

    private Integer single;
    private Integer doubleRm;
    private Integer triple;
    private Integer quadruple;
    private Integer special;
    private Integer adlTraining;   // 작업/ADL 훈련실
    private Integer programRoom;
    private Integer diningKitchen;
    private Integer toilet;
    private Integer bath;
    private Integer laundry;

    private String homepage;
    private String transport;
    private String parking;

    // 목록성 데이터 (필요 시)
    private List<ProgramDto> programs;     // getProgramSttusDetailInfoList02
    private List<ContractDto> contracts;   // getConvInsttDetailInfoList02
}
