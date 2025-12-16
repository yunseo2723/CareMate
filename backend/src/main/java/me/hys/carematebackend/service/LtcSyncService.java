package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.ltc.*;
import me.hys.carematebackend.dto.ltc.GovLtcItem;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LtcSyncService {
    private final GovLtcApiClient govListApi;
    private final LtcClient ltcDetailApi;
    private final LtcFacilityRepository repo;
    private final RoadnameResolver roadnameResolver;
    private final GeoService geoService;


    private final LtcXmlParser parser = new LtcXmlParser();
    private final ObjectMapper om = new ObjectMapper();

    public int syncSido(String sidoCd) {

        log.info("### Sync START (sido={})", sidoCd);

        List<GovLtcItem> list = govListApi.fetchFacilitiesBySido(sidoCd);
        int count = 0;

        for (GovLtcItem item : list) {

            String inst = item.getInstCode();
            String kind = item.getKindCode();

            if (inst == null || inst.isBlank()) continue;
            LtcFacility f = new LtcFacility();

            // 목록 정보
            f.setInstCode(inst);
            f.setKindCode(kind);

            // 상세 정보
            GeneralDto g = parser.parseGeneral(ltcDetailApi.general(inst, kind).block());
            if (g != null) {
                f.setName(g.getAdminNm());

                f.setRoadNmCd(g.getRoadNmCd());

                String roadNm = roadnameResolver.resolve(g.getRoadNmCd());
                f.setRoadNm(roadNm);

                String fullAddr = buildFullAddr(roadNm, g.getGunmulMlno(), g.getGunmulSlno());
                f.setFullRoadNm(fullAddr);

                GeoService.Coord coord = geoService.resolve(fullAddr);
                if (coord != null) {
                    f.setLat(coord.getLat());
                    f.setLng(coord.getLng());
                }

                f.setPhone(g.getFullTel());
                f.setLongTermPeribRgtDt(g.getLongTermPeribRgtDt());
                f.setPostNo(g.getHmPostNo());
            }

            StaffDto s = parser.parseStaff(ltcDetailApi.staff(inst, kind).block());
            if (s != null) {
                f.setSocialWorker(s.getSocWel());
                f.setDoctor(s.getChrgDoc());
                f.setNurse(s.getNur());
                f.setNurseAide(s.getNurArticle());
                f.setDentist(s.getDent());
                f.setPhysicalTher(s.getPhysicalMTret());
                f.setOccupTher(s.getWrkMTret());
                f.setCaregiver(s.getRecuProt_1());
                f.setNutritionist(s.getNut());
                f.setCook(s.getCook());
                f.setManager(s.getMgmtPrsn());
                f.setAssistant(s.getSuppPrsn());
                f.setEtcPer(s.getEtcPer());
            }

            RoomsDto r = parser.parseRooms(ltcDetailApi.instt(inst, kind).block());
            if (r != null) {
                f.setSingleRm(r.getPrsnRoomreal1());
                f.setDoubleRm(r.getPrsnRoomreal2());
                f.setTripleRm(r.getPrsnRoomreal3());
                f.setQuadrupleRm(r.getPrsnRoomreal4());
                f.setSpecialRm(r.getSpcAcupRoomreal());
                f.setAdlTraining(r.getFuncTrnRoomreal());
                f.setProgramRoom(r.getPgmRoomreal());
                f.setDiningKitchen(r.getCrmnyPrst());
                f.setToilet(r.getBatRoom());
                f.setBath(r.getTaxPageLong());
                f.setLaundry(r.getTaxRoom());
            }

            AceptncDto ac = parser.parseAcept(ltcDetailApi.aceptnc(inst, kind).block());
            if (ac != null) {
                f.setCapacityTotal(ac.getTotPer());
                f.setResidentMale(ac.getMaNowPer());
                f.setResidentFemale(ac.getFmNowPer());
                f.setWaitMale(ac.getMaRsvPer());
                f.setWaitFemale(ac.getFmRsvPer());
            }

            EtcDto e = parser.parseEtc(ltcDetailApi.etc(inst, kind).block());
            if (e != null) {
                f.setHomepage(e.getHmpgAddr());
                f.setTransport(e.getTfMth());
                f.setParking(e.getPkngEquip());
            }

            // ================= 프로그램 리스트 =================

            try {
                String programXml = ltcDetailApi.programList(inst).block();
                List<ProgramDto> programs = parser.parseProgramList(programXml);

                if (programs != null && !programs.isEmpty()) {
                    String json = om.writeValueAsString(programs);
                    f.setProgramsJson(json);   // 🔸 LtcFacility에 String 필드 존재한다고 가정
                }
            } catch (Exception ex) {
                log.warn("프로그램 파싱 실패 instCode={}", inst, ex);
            }

            try {
                String contractXml = ltcDetailApi.convList(inst).block();
                List<ContractDto> contracts = parser.parseContractList(contractXml);

                if (contracts != null && !contracts.isEmpty()) {
                    String json = om.writeValueAsString(contracts);
                    f.setContractsJson(json);   // 마찬가지로 String 필드라고 가정
                }
            } catch (Exception ex) {
                log.warn("계약정보 파싱 실패 instCode={}", inst, ex);
            }

            // ================= 비급여 항목 리스트 =================

            try {
                String nonBenefitXml = ltcDetailApi.nonBenefitList(inst).block();
                List<NonBenefitDto> nonBenefits = parser.parseNonBenefitList(nonBenefitXml);

                if (nonBenefits != null && !nonBenefits.isEmpty()) {
                    String json = om.writeValueAsString(nonBenefits);
                    f.setNonbenefitJson(json);   // 🔸 LtcFacility에 String 필드 존재한다고 가정
                }
            } catch (Exception ex) {
                log.warn("프로그램 파싱 실패 instCode={}", inst, ex);
            }


            f.setLastUpdate(LocalDate.now());
            repo.saveAndFlush(f);

            count++;
            if (count % 100 == 0)
                log.info("... synced {}", count);
        }

        log.info("### Sync DONE (sido={}, total={})", sidoCd, count);
        return count;
    }

    private String buildFullAddr(String base, String gunmulMlno, String gunmulSlno) {
        if (base == null) base = "";
        base = base.trim();

        gunmulMlno = (gunmulMlno == null ? "" : gunmulMlno.trim());
        gunmulSlno = (gunmulSlno == null ? "" : gunmulSlno.trim());

        boolean hasMain = !gunmulMlno.isEmpty() && !gunmulMlno.equals("0");
        boolean hasSub  = !gunmulSlno.isEmpty() && !gunmulSlno.equals("0");

        if (!hasMain) return base;
        if (!hasSub)  return base + " " + gunmulMlno;
        return base + " " + gunmulMlno + "-" + gunmulSlno;
    }
}
