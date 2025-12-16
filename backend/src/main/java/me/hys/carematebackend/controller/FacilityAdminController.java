package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.FacilityInfoDto;
import me.hys.carematebackend.service.FacilityAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/facility")
public class FacilityAdminController {

    private final FacilityAdminService facilityAdminService;

    @GetMapping("/admin/{instCode}/info")
    public ResponseEntity<FacilityInfoDto> getFacilityInfo(
            @PathVariable String instCode
    ) {
        return ResponseEntity.ok(facilityAdminService.getFacilityInfo(instCode));
    }
}
