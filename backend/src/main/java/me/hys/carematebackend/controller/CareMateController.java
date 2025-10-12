package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.caremate.CareMateCardRes;
import me.hys.carematebackend.dto.caremate.CareMateDetailRes;
import me.hys.carematebackend.service.CareMateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/caremates")
public class CareMateController {

    private final CareMateService service;

    // 목록: /caremates?region=서울&budgetMax=1300000&specialty=치매&lat=37.5&lng=127.0&page=0&size=20&sort=rating,desc
    @GetMapping
    public Page<CareMateCardRes> list(
            @RequestParam(required=false) String region,
            @RequestParam(required=false) Integer budgetMax,
            @RequestParam(required=false) String specialty,
            @RequestParam(required=false, name="lat") Double userLat,
            @RequestParam(required=false, name="lng") Double userLng,
            Pageable pageable
    ) {
        return service.list(region, budgetMax, specialty, userLat, userLng, pageable);
    }

    // 상세: /caremates/{id}
    @GetMapping("/{id}")
    public CareMateDetailRes detail(@PathVariable Long id){
        return service.detail(id);
    }
}
