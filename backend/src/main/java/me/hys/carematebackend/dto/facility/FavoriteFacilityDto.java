package me.hys.carematebackend.dto.facility;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FavoriteFacilityDto {
    private String instCode;
    private String kindCode;
    private String name;
    private String address;
    private LocalDateTime createdAt;
}
