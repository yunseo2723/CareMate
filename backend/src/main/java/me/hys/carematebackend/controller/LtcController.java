package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.service.LtcClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ltc")
@RequiredArgsConstructor
public class LtcController {
    private final LtcClient ltc;

    @GetMapping("/general")
    public Mono<ResponseEntity<String>> general(
            @RequestParam String instCode,
            @RequestParam String kindCode
    ) {
        return ltc.general(instCode, kindCode).map(ResponseEntity::ok);
    }

    @GetMapping("/staff")
    public Mono<ResponseEntity<String>> staff(
            @RequestParam String instCode,
            @RequestParam String kindCode
    ) {
        return ltc.staff(instCode, kindCode).map(ResponseEntity::ok);
    }

    @GetMapping("/instt")
    public Mono<ResponseEntity<String>> instt(
            @RequestParam String instCode,
            @RequestParam String kindCode
    ) {
        return ltc.instt(instCode, kindCode).map(ResponseEntity::ok);
    }

    @GetMapping("/capacity")
    public Mono<ResponseEntity<String>> capacity(
            @RequestParam String instCode,
            @RequestParam String kindCode
    ) {
        return ltc.aceptncNmpr(instCode, kindCode).map(ResponseEntity::ok);
    }

    @GetMapping("/nonpay")
    public Mono<ResponseEntity<String>> nonpay(
            @RequestParam String instCode,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ltc.nonBenefitList(instCode, pageNo, size).map(ResponseEntity::ok);
    }
}
