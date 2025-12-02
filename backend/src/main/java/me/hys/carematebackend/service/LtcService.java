package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcService {

    private final LtcClient client;      // ❗ LtcClient는 각 API를 Mono<String> 으로 반환
    private final XmlMapper xml = new XmlMapper();

    /* ---------- 공통 유틸 ---------- */

    private JsonNode firstItem(String xmlStr) {
        try {
            if (xmlStr == null) throw new RuntimeException("Upstream returned null body");
            String s = xmlStr.stripLeading();
            if (s.startsWith("\uFEFF")) s = s.substring(1); // BOM 제거
            if (!s.startsWith("<")) {
                String head = s.substring(0, Math.min(400, s.length())).replaceAll("[\\r\\n]+", " ");
                throw new RuntimeException("Upstream did NOT return XML. HEAD=" + head);
            }

            JsonNode root = xml.readTree(s);
            JsonNode body = root.path("body");

            // 1) <body><items><item>...</item></items></body>
            JsonNode items = body.path("items");
            if (!items.isMissingNode() && !items.isNull()) {
                JsonNode item = items.path("item");
                if (!item.isMissingNode() && !item.isNull()) {
                    return item.isArray() ? (item.size() > 0 ? item.get(0) : null) : item;
                }
            }

            // 2) <body><item>...</item></body>
            JsonNode itemDirect = body.path("item");
            if (!itemDirect.isMissingNode() && !itemDirect.isNull()) {
                return itemDirect.isArray() ? (itemDirect.size() > 0 ? itemDirect.get(0) : null) : itemDirect;
            }

            // 3) 혹시 <body> 아래가 바로 필드들인 경우(희귀)
            if (!body.isMissingNode() && body.size() > 0) {
                return body;
            }

            return null;
        } catch (Exception e) {
            throw new RuntimeException("XML parse failed", e);
        }
    }

    private static String txt(JsonNode n, String key) {
        JsonNode v = n.path(key);
        if (v.isMissingNode() || v.isNull()) return null;
        String s = v.asText();
        return (s == null || s.isEmpty()) ? null : s;
    }

    private static Integer i(JsonNode n, String key) {
        try { String s = txt(n, key); return s == null ? null : Integer.valueOf(s); }
        catch (Exception ignore) { return null; }
    }

    /* ---------- 각 API 파서 ---------- */

    // 1) 일반현황
    private GeneralDto parseGeneral(String xmlStr) {
        JsonNode it = firstItem(xmlStr);
        if (it == null) return null;

        GeneralDto d = new GeneralDto();
        d.setLongTermAdminSym(txt(it, "longTermAdminSym"));
        d.setAdminPttnCd(txt(it, "adminPttnCd"));
        d.setAdminNm(txt(it, "adminNm"));
        d.setHmPostNo(txt(it, "hmPostNo"));
        d.setLocTelNo_1(txt(it, "locTelNo_1"));
        d.setLocTelNo_2(txt(it, "locTelNo_2"));
        d.setLocTelNo_3(txt(it, "locTelNo_3"));
        d.buildFullTel();
        d.setLongTermPeribRgtDt(txt(it, "longTermPeribRgtDt"));
        return d;
    }

    // 2) 인력현황
    private StaffDto parseStaff(String xmlStr) {
        JsonNode it = firstItem(xmlStr);
        if (it == null) return null;

        StaffDto s = new StaffDto();
        s.setSocWel(i(it, "socWel"));
        s.setChrgDoc(i(it, "chrgDoc"));
        s.setNur(i(it, "nur"));
        s.setNurArticle(i(it, "nurArticle"));
        s.setDent(i(it, "dent"));
        s.setPhysicalMTret(i(it, "physicalMTret"));
        s.setWrkMTret(i(it, "wrkMTret"));
        s.setRecuProt_1(i(it, "recuProt_1"));
        s.setNut(i(it, "nut"));
        s.setCook(i(it, "cook"));
        s.setMgmtPrsn(i(it, "mgmtPrsn"));
        s.setSuppPrsn(i(it, "suppPrsn"));
        s.setEtcPer(i(it, "etcPer"));
        return s;
    }

    // 3) 시설현황
    private RoomsDto parseInstt(String xmlStr) {
        JsonNode it = firstItem(xmlStr);
        if (it == null) return null;

        RoomsDto r = new RoomsDto();
        r.setPrsnRoomreal1(i(it, "prsnRoomreal1"));
        r.setPrsnRoomreal2(i(it, "prsnRoomreal2"));
        r.setPrsnRoomreal3(i(it, "prsnRoomreal3"));
        r.setPrsnRoomreal4(i(it, "prsnRoomreal4"));
        r.setSpcAcupRoomreal(i(it, "spcAcupRoomreal"));
        r.setFuncTrnRoomreal(i(it, "funcTrnRoomreal"));
        r.setPgmRoomreal(i(it, "pgmRoomreal"));
        r.setCrmnyPrst(i(it, "crmnyPrst"));
        r.setBatRoom(i(it, "batRoom"));
        r.setTaxPageLong(i(it, "taxPageLong"));
        r.setTaxRoom(i(it, "taxRoom"));
        return r;
    }

    // 8) 입소인원현황
    private AceptncDto parseAceptnc(String xmlStr) {
        JsonNode it = firstItem(xmlStr);
        if (it == null) return null;

        AceptncDto a = new AceptncDto();
        a.setTotPer(i(it, "totPer"));
        a.setMaNowPer(i(it, "maNowPer"));
        a.setFmNowPer(i(it, "fmNowPer"));
        a.setMaRsvPer(i(it, "maRsvPer"));
        a.setFmRsvPer(i(it, "fmRsvPer"));
        return a;
    }

    // 9) 기타현황
    private EtcDto parseEtc(String xmlStr) {
        JsonNode it = firstItem(xmlStr);
        if (it == null) return null;

        EtcDto e = new EtcDto();
        e.setHmpgAddr(txt(it, "hmpgAddr"));
        e.setTfMth(txt(it, "tfMth"));
        e.setPkngEquip(txt(it, "pkngEquip"));
        return e;
    }

    // 5) 프로그램 목록
    private List<ProgramDto> parsePrograms(String xmlStr) {
        try {
            JsonNode root = xml.readTree(xmlStr);
            JsonNode items = root.path("body").path("items").path("item");
            List<ProgramDto> out = new ArrayList<>();
            if (items.isMissingNode() || items.isNull()) return out;
            if (items.isArray()) {
                for (JsonNode it : items) out.add(mapProgram(it));
            } else out.add(mapProgram(items));
            return out;
        } catch (Exception e) {
            throw new RuntimeException("XML parse failed(program)", e);
        }
    }

    private ProgramDto mapProgram(JsonNode it) {
        ProgramDto p = new ProgramDto();
        p.setPgmType(txt(it, "pgmType"));
        p.setPgmNm(txt(it, "pgmNm"));
        p.setTgtNop(i(it, "tgtNop"));
        p.setCyclTm(txt(it, "cyclTm"));
        p.setRunPlc(txt(it, "runPlc"));
        return p;
    }

    // 6) 협약 목록
    private List<ContractDto> parseContracts(String xmlStr) {
        try {
            JsonNode root = xml.readTree(xmlStr);
            JsonNode items = root.path("body").path("items").path("item");
            List<ContractDto> out = new ArrayList<>();
            if (items.isMissingNode() || items.isNull()) return out;
            if (items.isArray()) {
                for (JsonNode it : items) out.add(mapContract(it));
            } else out.add(mapContract(items));
            return out;
        } catch (Exception e) {
            throw new RuntimeException("XML parse failed(contracts)", e);
        }
    }

    private ContractDto mapContract(JsonNode it) {
        ContractDto c = new ContractDto();
        c.setYoyangNm(txt(it, "yoyangNm"));
        c.setAdptFrDt(txt(it, "adptFrDt"));
        c.setAdptToDt(txt(it, "adptToDt"));
        return c;
    }

    /* ---------- 상세 조립 ---------- */

    public Mono<FacilityDetailDto> detail(String instCode, String kindCode) {
        return Mono.zip(
                client.general(instCode, kindCode),     // Mono<String>
                client.staff(instCode, kindCode),       // Mono<String>
                client.instt(instCode, kindCode),       // Mono<String>
                client.aceptnc(instCode, kindCode),     // Mono<String>
                client.programList(instCode, 1, 50), // Mono<String>
                client.convList(instCode, 1, 50),    // Mono<String>
                client.etc(instCode, kindCode)          // Mono<String>
        ).map(t -> {
            String xmlGeneral  = t.getT1();
            String xmlStaff    = t.getT2();
            String xmlInstt    = t.getT3();
            String xmlAceptnc  = t.getT4();
            String xmlProgram  = t.getT5();
            String xmlContract = t.getT6();
            String xmlEtc      = t.getT7();

            GeneralDto g   = parseGeneral(xmlGeneral);
            StaffDto staff = parseStaff(xmlStaff);
            RoomsDto rooms = parseInstt(xmlInstt);
            AceptncDto ac  = parseAceptnc(xmlAceptnc);
            List<ProgramDto> programs = parsePrograms(xmlProgram);
            List<ContractDto> contracts = parseContracts(xmlContract);
            EtcDto etc = parseEtc(xmlEtc);

            FacilityDetailDto out = new FacilityDetailDto();

            if (ac != null) {
                out.setInstCode(g.getLongTermAdminSym());
                out.setKindCode(g.getAdminPttnCd());
                out.setName(g.getAdminNm());
                out.setPost(g.getHmPostNo());
                out.setPhone(g.getFullTel());
                out.setDesignatedAt(g.getLongTermPeribRgtDt());
            }

            if (ac != null) {
                out.setCapacityTotal(ac.getTotPer());
                out.setResidentMale(ac.getMaNowPer());
                out.setResidentFemale(ac.getFmNowPer());
            }

            if (staff != null) {
                out.setDoctor(staff.getChrgDoc());
                out.setNurse(staff.getNur());
                out.setCaregiver(staff.getRecuProt_1());
                out.setSocialWorker(staff.getSocWel());
                out.setNurseAide(staff.getNurArticle());
                out.setPhysicalTher(staff.getPhysicalMTret());
                out.setOccupTher(staff.getWrkMTret());
                out.setNutritionist(staff.getNut());
                out.setCook(staff.getCook());
                out.setManager(staff.getMgmtPrsn());
                out.setAssistant(staff.getSuppPrsn());
                out.setEtcPer(staff.getEtcPer());
            }

            if (rooms != null) {
                out.setSingle(rooms.getPrsnRoomreal1());
                out.setDoubleRm(rooms.getPrsnRoomreal2());
                out.setTriple(rooms.getPrsnRoomreal3());
                out.setQuadruple(rooms.getPrsnRoomreal4());
                out.setSpecial(rooms.getSpcAcupRoomreal());
                out.setAdlTraining(rooms.getFuncTrnRoomreal());
                out.setProgramRoom(rooms.getPgmRoomreal());
                out.setDiningKitchen(rooms.getCrmnyPrst());
                out.setToilet(rooms.getBatRoom());
                out.setBath(rooms.getTaxPageLong());
                out.setLaundry(rooms.getTaxRoom());
            }

            out.setPrograms(programs);
            out.setContracts(contracts);

            if (etc != null) {
                out.setHomepage(etc.getHmpgAddr());
                out.setTransport(etc.getTfMth());
                out.setParking(etc.getPkngEquip());
            }

            return out;
        });
    }
}
