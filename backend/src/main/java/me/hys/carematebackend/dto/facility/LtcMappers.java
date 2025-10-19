package me.hys.carematebackend.dto.facility;

import me.hys.carematebackend.model.LtcFacility;

public class LtcMappers {
    public static FacilitySummaryDto toSummary(LtcFacility f){
        return new FacilitySummaryDto(
                f.getId(), f.getName(), f.getType(), f.getSido(), f.getSgg(),
                f.getCapacityTotal(), f.getResidentMale(), f.getResidentFemale(),
                f.getLat(), f.getLon()
        );
    }
    public static StaffDto toStaff(LtcFacility f){ return new StaffDto(
            f.getStaffDirector(), f.getStaffOfficeHead(), f.getStaffSocialWorker(),
            f.getStaffDoctorFulltime(), f.getStaffDoctorContract(),
            f.getStaffNurse(), f.getStaffNurseAide(),
            f.getStaffCaregiverLevel1(), f.getStaffCaregiverLevel2(), f.getStaffCaregiverDeferred(),
            f.getStaffOffice(), f.getStaffNutritionist(), f.getStaffCook(),
            f.getStaffCleaner(), f.getStaffManager(), f.getStaffAssistant(), f.getStaffEtc()
    );}
    public static FacilityRoomsDto toRooms(LtcFacility f){ return new FacilityRoomsDto(
            f.getRoomCount(), f.getRoom1p(), f.getRoom2p(), f.getRoom3p(), f.getRoom4p(),
            f.getSpecialRoom(), f.getOfficeCount(), f.getMedNurseRoom(), f.getAdlTrainingRoom(),
            f.getProgramRoom(), f.getDiningKitchen(), f.getToiletCount(), f.getWashBathCount(), f.getLaundryDryCount()
    );}
    public static NonpayDto toNonpay(LtcFacility f){ return new NonpayDto(
            f.getNonpayKindCode(), f.getNonpayKindName(), f.getNonpayAmount(), f.getNonpayBasis(), f.getNonpayUptDt()
    );}
    public static ProgramDto toProgram(LtcFacility f){ return new ProgramDto(
            f.getProgramTypeCode(), f.getProgramTypeName(), f.getProgramName(),
            f.getProgramTargetCount(), f.getProgramCycleText(), f.getProgramPlace()
    );}
    public static ContractDto toContract(LtcFacility f){ return new ContractDto(
            f.getContractOrgName(), f.getContractStart(), f.getContractEnd()
    );}
    public static WelfareToolDto toWelfare(LtcFacility f){ return new WelfareToolDto(
            f.getWelfareReportCode(), f.getWelfareReportName(), f.getToolName(),
            f.getToolManufacturer(), f.getToolModel(), f.getToolUsage(), f.getToolRemark()
    );}
}