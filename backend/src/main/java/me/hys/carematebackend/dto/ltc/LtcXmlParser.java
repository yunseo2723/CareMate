package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;

/**
 * 공공데이터 LTC XML → DTO 변환기
 */
@Slf4j
public class LtcXmlParser {

    private final XmlMapper mapper;

    public LtcXmlParser() {
        this.mapper = XmlMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .build();
    }

    /** 공통: 쓸데없는 <script/> 태그 제거 */
    private String cleanXml(String xml) {
        if (xml == null) return null;
        return xml
                .replaceAll("<script\\s*/>", "")
                .replaceAll("<script></script>", "");
    }

    /* ====================== 공통 파서 ====================== */

    /** 상세 API (body 아래에 item 바로 오는 구조) */
    private <T> T parseDetail(String xml, Class<T> clazz) {
        try {
            xml = cleanXml(xml);
            if (xml == null || xml.isBlank()) {
                log.warn("❌ XML empty");
                return null;
            }

            ApiDetailEnvelope<T> env = mapper.readValue(
                    xml,
                    mapper.getTypeFactory().constructParametricType(ApiDetailEnvelope.class, clazz)
            );

            if (env == null || env.getBody() == null) {
                log.warn("❌ XML has no <body>: {}", safeHead(xml));
                return null;
            }

            List<T> items = env.getBody().getItem();
            if (items == null || items.isEmpty()) {
                log.warn("⚠ XML has empty <item>: {}", safeHead(xml));
                return null;
            }

            return items.get(0);

        } catch (Exception e) {
            log.error("❌ XML Parse Error (detail): {}", e.getMessage());
            log.debug("XML FULL: {}", xml);
            return null;
        }
    }

    /** 목록 API (body/items/item 구조) */
    private <T> List<T> parseList(String xml, Class<T> clazz) {
        try {
            xml = cleanXml(xml);
            if (xml == null || xml.isBlank()) {
                log.warn("❌ XML empty (list)");
                return Collections.emptyList();
            }

            ApiListEnvelope<T> env = mapper.readValue(
                    xml,
                    mapper.getTypeFactory().constructParametricType(ApiListEnvelope.class, clazz)
            );

            if (env == null || env.getBody() == null || env.getBody().getItems() == null) {
                log.warn("❌ XML has no body/items: {}", safeHead(xml));
                return Collections.emptyList();
            }

            List<T> list = env.getBody().getItems().getItem();
            if (list == null) {
                log.warn("⚠ XML items.item is null: {}", safeHead(xml));
                return Collections.emptyList();
            }

            return list;

        } catch (Exception e) {
            log.error("❌ XML Parse Error (list): {}", e.getMessage());
            log.debug("XML FULL: {}", xml);
            return Collections.emptyList();
        }
    }

    private String safeHead(String xml) {
        if (xml == null) return "null";
        return xml.substring(0, Math.min(200, xml.length()))
                .replaceAll("[\\r\\n]+", " ");
    }

    /* ====================== 개별 DTO용 헬퍼 ====================== */

    public GeneralDto parseGeneral(String xml) {
        return parseDetail(xml, GeneralDto.class);
    }

    public StaffDto parseStaff(String xml) {
        return parseDetail(xml, StaffDto.class);
    }

    public RoomsDto parseRooms(String xml) {
        return parseDetail(xml, RoomsDto.class);
    }

    public AceptncDto parseAcept(String xml) {
        return parseDetail(xml, AceptncDto.class);
    }

    public EtcDto parseEtc(String xml) {
        return parseDetail(xml, EtcDto.class);
    }

    public List<ProgramDto> parseProgramList(String xml) { return parseList(xml, ProgramDto.class); }

    public List<ContractDto> parseContractList(String xml) {
        return parseList(xml, ContractDto.class);
    }

    public List<NonBenefitDto> parseNonBenefitList(String xml) { return parseList(xml, NonBenefitDto.class); }
}
