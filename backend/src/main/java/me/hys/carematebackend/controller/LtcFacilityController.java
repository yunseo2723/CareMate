package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.*;
import me.hys.carematebackend.service.LtcFacilityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
@CrossOrigin // 필요시 도메인 지정
public class LtcFacilityController {

    private final LtcFacilityService service;

    // 목록(요약)
    @GetMapping
    public Page<FacilitySummaryDto> list(
            @RequestParam(required=false) String sido,
            @RequestParam(required=false) String sgg,
            @RequestParam(required=false) String type,
            @RequestParam(required=false) String q,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size,
            @RequestParam(defaultValue="name,asc") String sort){
        String[] s = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.by(s[0]).with(
                (s.length>1 && "desc".equalsIgnoreCase(s[1])) ? Sort.Direction.DESC : Sort.Direction.ASC)));
        return service.search(sido, sgg, type, q, pageable);
    }

    // 상세(전체)
    @GetMapping("/{id}") public FacilityDetailDto detail(@PathVariable String id){ return service.detail(id); }

    // 섹션별
    @GetMapping("/{id}/staff") public StaffDto staff(@PathVariable String id){ return service.staff(id); }
    @GetMapping("/{id}/rooms") public FacilityRoomsDto rooms(@PathVariable String id){ return service.rooms(id); }
    @GetMapping("/{id}/nonpay") public NonpayDto nonpay(@PathVariable String id){ return service.nonpay(id); }
    @GetMapping("/{id}/program") public ProgramDto program(@PathVariable String id){ return service.program(id); }
    @GetMapping("/{id}/contract") public ContractDto contract(@PathVariable String id){ return service.contract(id); }
    @GetMapping("/{id}/welfare") public WelfareToolDto welfare(@PathVariable String id){ return service.welfare(id); }
}
