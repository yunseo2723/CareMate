package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.ltc.*;
import me.hys.carematebackend.dto.response.GovLtcItem;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LtcSyncService {

    private final GovLtcApiClient govListApi;
    private final LtcClient ltcDetailApi;
    private final LtcFacilityRepository repo;

    private final LtcXmlParser parser = new LtcXmlParser();

    public int syncSido(String sidoCd) {

        log.info("### Sync START (sido={})", sidoCd);

        List<GovLtcItem> list = govListApi.fetchFacilitiesBySido(sidoCd);
        int count = 0;

        for (GovLtcItem item : list) {

            String inst = item.getInstCode();
            String kind = item.getKindCode();

            if (inst == null || inst.isBlank()) continue;

            LtcFacility f = new LtcFacility();
            f.setInstCode(inst);

            // 목록 정보
            f.setInstCode(inst);
            f.setKindCode(kind);
            f.setName(item.getName());
            f.setSiDoCd(item.getSiDoCd());
            f.setSiGunGuCd(item.getSiGunGuCd());

            // 상세 정보
            GeneralDto g = parser.parseGeneral(ltcDetailApi.general(inst, kind).block());
            if (g != null) {
                f.setRoadAddr(g.getRoadNmCd());
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

            f.setLastUpdate(LocalDate.now());
            repo.saveAndFlush(f);

            count++;
            if (count % 100 == 0)
                log.info("... synced {}", count);
        }

        log.info("### Sync DONE (sido={}, total={})", sidoCd, count);
        return count;
    }
}
