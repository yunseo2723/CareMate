package me.hys.carematebackend.dto.facility;

public record FacilityRoomsDto(
        Integer roomCount, Integer room1p, Integer room2p, Integer room3p, Integer room4p,
        Integer specialRoom, Integer officeCount, Integer medNurseRoom, Integer adlTrainingRoom,
        Integer programRoom, Integer diningKitchen, Integer toiletCount, Integer washBathCount, Integer laundryDryCount
) {}