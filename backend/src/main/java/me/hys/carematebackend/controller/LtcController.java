package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.ltc.FacilityLiteRes;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ltc")
@RequiredArgsConstructor
public class LtcController {

    private final LtcFacilityRepository repo;

    // 전국 Lite 리스트
    @GetMapping("/list/lite")
    public List<FacilityLiteRes> listLite(
            @RequestParam(value = "siDoCd", required = false) String siDoCd
    ) {
        List<LtcFacility> all;
        if (siDoCd == null || siDoCd.isBlank()) {
            all = repo.findAll();
        } else {
            all = repo.findAll().stream()
                    .filter(f -> siDoCd.equals(f.getSiDoCd()))
                    .toList();
        }
        return all.stream()
                .map(FacilityLiteRes::from)
                .toList();
    }
}