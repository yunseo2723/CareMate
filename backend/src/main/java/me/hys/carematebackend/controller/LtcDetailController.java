package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.FacilityDetailDto;
import me.hys.carematebackend.service.LtcService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ltc")
public class LtcDetailController {

    private final LtcService ltcService;

    // 예: GET /ltc/detail?instCode=21130500195&kindCode=B03
    @GetMapping("/detail")
    public Mono<ResponseEntity<FacilityDetailDto>> detail(
            @RequestParam("instCode") String instCode,
            @RequestParam("kindCode") String kindCode
    ) {
        return ltcService.detail(instCode, kindCode)
                .map(ResponseEntity::ok);
    }
}
