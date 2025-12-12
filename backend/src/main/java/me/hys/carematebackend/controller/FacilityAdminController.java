package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.FacilityInfoDto;
import me.hys.carematebackend.service.FacilityAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
