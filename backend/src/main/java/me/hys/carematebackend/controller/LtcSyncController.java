package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.service.LtcSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ltc")
@RequiredArgsConstructor
public class LtcSyncController {

    private final LtcSyncService service;

    // 전국 17개 시도 전체 동기화
    @PostMapping("/sync/all")
    public ResponseEntity<?> syncAll() {

        String[] sidoList = {
                "11", "26", "27", "28", "29", "30", "31", "36",
                "41", "43", "44", "46", "47", "48", "50", "51", "52"

        };

        int total = 0;

        for (String sido : sidoList) {
            total += service.syncSido(sido);
        }

        return ResponseEntity.ok("Synced ALL sido → total: " + total);
    }

    // 시도 하나만 동기화
    @PostMapping("/sync/{sido}")
    public ResponseEntity<?> syncOne(@PathVariable String sido) {
        int count = service.syncSido(sido);
        return ResponseEntity.ok("Synced sido=" + sido + " → " + count);
    }
}
