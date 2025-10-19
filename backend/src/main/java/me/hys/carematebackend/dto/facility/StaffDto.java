package me.hys.carematebackend.dto.facility;

public record StaffDto(
        Integer staffDirector, Integer staffOfficeHead, Integer staffSocialWorker,
        Integer staffDoctorFulltime, Integer staffDoctorContract,
        Integer staffNurse, Integer staffNurseAide,
        Integer staffCaregiverLevel1, Integer staffCaregiverLevel2, Integer staffCaregiverDeferred,
        Integer staffOffice, Integer staffNutritionist, Integer staffCook,
        Integer staffCleaner, Integer staffManager, Integer staffAssistant, Integer staffEtc
) {}