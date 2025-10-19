package me.hys.carematebackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter; import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name="ltc_facility")
public class LtcFacility {

    @Id private String id;

    @Column(name="institution_code") private String institutionCode;
    private String adminPttnCd;
    private String name;
    private String type;

    private String sido;
    private String sgg;
    private String address;
    @Column(name="post_no") private String postNo;
    private String tel;
    private Double lat; private Double lon;

    @Column(name="sido_cd") private String sidoCd;
    @Column(name="sigungu_cd") private String sigunguCd;

    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="open_date") private LocalDate openDate;
    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="install_report_date") private LocalDate installReportDate;

    @Column(name="establish_type_cd") private Integer establishTypeCd;
    @Column(name="establish_type_nm") private String establishTypeNm;

    @Column(name="capacity_total") private Integer capacityTotal;
    @Column(name="resident_male") private Integer residentMale;
    @Column(name="resident_female") private Integer residentFemale;
    @Column(name="wait_male") private Integer waitMale;
    @Column(name="wait_female") private Integer waitFemale;

    // staff
    @Column(name="staff_director") private Integer staffDirector;
    @Column(name="staff_office_head") private Integer staffOfficeHead;
    @Column(name="staff_social_worker") private Integer staffSocialWorker;
    @Column(name="staff_doctor_fulltime") private Integer staffDoctorFulltime;
    @Column(name="staff_doctor_contract") private Integer staffDoctorContract;
    @Column(name="staff_nurse") private Integer staffNurse;
    @Column(name="staff_nurse_aide") private Integer staffNurseAide;
    @Column(name="staff_dental_hygienist") private Integer staffDentalHygienist;
    @Column(name="staff_physical_therapist") private Integer staffPhysicalTherapist;
    @Column(name="staff_occupational_therapist") private Integer staffOccupationalTherapist;
    @Column(name="staff_caregiver_level1") private Integer staffCaregiverLevel1;
    @Column(name="staff_caregiver_level2") private Integer staffCaregiverLevel2;
    @Column(name="staff_caregiver_deferred") private Integer staffCaregiverDeferred;
    @Column(name="staff_office") private Integer staffOffice;
    @Column(name="staff_nutritionist") private Integer staffNutritionist;
    @Column(name="staff_cook") private Integer staffCook;
    @Column(name="staff_cleaner") private Integer staffCleaner;
    @Column(name="staff_manager") private Integer staffManager;
    @Column(name="staff_assistant") private Integer staffAssistant;
    @Column(name="staff_etc") private Integer staffEtc;

    // facility rooms
    @Column(name="room_count") private Integer roomCount;
    @Column(name="room_1p") private Integer room1p;
    @Column(name="room_2p") private Integer room2p;
    @Column(name="room_3p") private Integer room3p;
    @Column(name="room_4p") private Integer room4p;
    @Column(name="special_room") private Integer specialRoom;
    @Column(name="office_count") private Integer officeCount;
    @Column(name="med_nurse_room") private Integer medNurseRoom;
    @Column(name="adl_training_room") private Integer adlTrainingRoom;
    @Column(name="program_room") private Integer programRoom;
    @Column(name="dining_kitchen") private Integer diningKitchen;
    @Column(name="toilet_count") private Integer toiletCount;
    @Column(name="wash_bath_count") private Integer washBathCount;
    @Column(name="laundry_dry_count") private Integer laundryDryCount;

    // nonpay
    @Column(name="nonpay_kind_code") private Integer nonpayKindCode;
    @Column(name="nonpay_kind_name") private String nonpayKindName;
    @Column(name="nonpay_amount") private Integer nonpayAmount;
    @Column(name="nonpay_basis") private String nonpayBasis;
    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="nonpay_upt_dt") private LocalDate nonpayUptDt;

    // program
    @Column(name="program_type_code") private Integer programTypeCode;
    @Column(name="program_type_name") private String programTypeName;
    @Column(name="program_name") private String programName;
    @Column(name="program_target_count") private Integer programTargetCount;
    @Column(name="program_cycle_text") private String programCycleText;
    @Column(name="program_place") private String programPlace;

    // contract
    @Column(name="contract_org_name") private String contractOrgName;
    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="contract_start") private LocalDate contractStart;
    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="contract_end") private LocalDate contractEnd;

    // welfare tool
    @Column(name="welfare_report_code") private String welfareReportCode;
    @Column(name="welfare_report_name") private String welfareReportName;
    @Column(name="tool_name") private String toolName;
    @Column(name="tool_manufacturer") private String toolManufacturer;
    @Column(name="tool_model") private String toolModel;
    @Column(name="tool_usage") private String toolUsage;
    @Column(name="tool_remark") private String toolRemark;

    private String homepage;
    private String transport;
    private String parking;

    @JsonFormat(pattern="yyyy-MM-dd") @Column(name="last_update") private LocalDate lastUpdate;
}
