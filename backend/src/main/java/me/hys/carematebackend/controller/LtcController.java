package me.hys.carematebackend.controller;

import me.hys.carematebackend.service.LtcSimilarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ltc")
public class LtcController {

    private final LtcSimilarService service;

    public LtcController(LtcSimilarService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<Map<String, Object>> search(
            @RequestParam(required = false) String siDo,
            @RequestParam(required = false) String kindCode,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.search(siDo, kindCode, size);
    }

    @GetMapping("/similar/{instCode}")
    public List<Map<String, Object>> similar(
            @PathVariable String instCode,
            @RequestParam(defaultValue = "5") int size
    ) {
        return service.similar(instCode, size);
    }
}