package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.*;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LtcFacilityService {
    private final LtcFacilityRepository repo;

    public Page<FacilitySummaryDto> search(String sido, String sgg, String type, String q, Pageable pageable){
        return repo.search(sido, sgg, type, q, pageable).map(LtcMappers::toSummary);
    }
    public FacilityDetailDto detail(String id){
        LtcFacility f = repo.findById(id).orElseThrow();
        return new FacilityDetailDto(f);
    }
    public StaffDto staff(String id){ return LtcMappers.toStaff(repo.findById(id).orElseThrow()); }
    public FacilityRoomsDto rooms(String id){ return LtcMappers.toRooms(repo.findById(id).orElseThrow()); }
    public NonpayDto nonpay(String id){ return LtcMappers.toNonpay(repo.findById(id).orElseThrow()); }
    public ProgramDto program(String id){ return LtcMappers.toProgram(repo.findById(id).orElseThrow()); }
    public ContractDto contract(String id){ return LtcMappers.toContract(repo.findById(id).orElseThrow()); }
    public WelfareToolDto welfare(String id){ return LtcMappers.toWelfare(repo.findById(id).orElseThrow()); }
}

