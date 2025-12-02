package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter; import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "ltc_facility")
@Getter @Setter @NoArgsConstructor
public class LtcFacility {

    @Id
    @Column(name = "inst_code")
    private String instCode;           // 기관 코드 (PK)

    private String kindCode;           // adminPttnCd
    private String name;               // adminNm
//    private String addr;
    private String roadAddr;
    private String postNo;
    private String phone;

    private String siDoCd;
    private String siGunGuCd;

    private Double lat;
    private Double lon;
    private String longTermPeribRgtDt;
    // ----- 정원/입소 -----
    private Integer capacityTotal;
    private Integer residentMale;
    private Integer residentFemale;
    private Integer waitMale;
    private Integer waitFemale;

    // ----- 직원 -----
    private Integer socialWorker;
    private Integer doctor;
    private Integer nurse;
    private Integer nurseAide;
    private Integer dentist;
    private Integer physicalTher;
    private Integer occupTher;
    private Integer caregiver;
    private Integer nutritionist;
    private Integer cook;
    private Integer manager;
    private Integer assistant;
    private Integer etcPer;

    // ----- 병실/시설 -----
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

    // ----- 기타 -----
    @Column(columnDefinition = "TEXT")
    private String homepage;
    @Column(columnDefinition = "TEXT")
    private String transport;
    @Column(columnDefinition = "TEXT")
    private String parking;

    @Column(name="last_update")
    private LocalDate lastUpdate;
}
