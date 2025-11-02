package me.hys.carematebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.FacilitySummaryDto;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LtcSearchService {

    private final LtcSearchClient client;
    private final XmlMapper xml = new XmlMapper();

    /* ---------------- 공통 유틸 ---------------- */

    /** n.path(k1|k2|...) 중 첫 번째 유효 텍스트 반환 */
    private static String orTxt(JsonNode n, String... keys) {
        for (String k : keys) {
            if (k == null) continue;
            JsonNode v = n.path(k);
            if (!v.isMissingNode() && !v.isNull()) {
                String s = v.asText();
                if (s != null && !s.isBlank()) return s;
            }
        }
        return null;
    }

    /** <body><items><item>... | <body><item>...  모두 지원해서 item 배열로 반환 */
    private Iterable<JsonNode> iterItems(String xmlStr) {
        try {
            final JsonNode root = xml.readTree(xmlStr);
            final JsonNode body = root.path("body");
            JsonNode items = body.path("items").path("item");
            if (items.isMissingNode() || items.isNull()) {
                // items가 없고 item만 바로 오는 경우
                items = body.path("item");
            }
            if (items.isMissingNode() || items.isNull()) {
                return List.of();
            }
            if (items.isArray()) {
                List<JsonNode> list = new ArrayList<>();
                items.forEach(list::add);
                return list;
            }
            // 단일 item
            return List.of(items);
        } catch (Exception e) {
            throw new RuntimeException("XML parse failed in LtcSearchService", e);
        }
    }

    /* ---------------- 목록 서비스 ---------------- */

    /**
     * 시/도코드 필수, 나머지 옵션.
     * 클라이언트(LtcSearchClient.list)의 시그니처와 반드시 맞춘다.
     */
    public Mono<List<FacilitySummaryDto>> list(
            String siDoCd,                  // ✅ 필수
            String siGunGuCd,               // 옵션
            String adminPttnCd,             // 옵션 (기관유형 A03/B03/C06 등)
            String startRgtDt, String endRgtDt,           // 옵션(지정일 기간, YYYYMMDD)
            String startStpRptDt, String endStpRptDt,     // 옵션(신고일 기간)
            String adminNm                 // 옵션(기관명 키워드)
    ) {
        if (siDoCd == null || siDoCd.isBlank()) {
            return Mono.error(new IllegalArgumentException("siDoCd is required"));
        }

        return client.list(
                siDoCd, siGunGuCd, adminPttnCd,
                startRgtDt, endRgtDt, startStpRptDt, endStpRptDt,
                adminNm
        ).map(xmlStr -> {
            List<FacilitySummaryDto> out = new ArrayList<>();

            for (JsonNode it : iterItems(xmlStr)) {
                FacilitySummaryDto f = new FacilitySummaryDto();

                // 기관코드/이름
                f.setInstCode(orTxt(it, "longTermAdminSym", "instCode", "institutionCode"));
                f.setName(orTxt(it, "adminNm", "name", "insttNm"));

                // 주소: 문서마다 조합이 다를 수 있으니 최대한 안전하게 구성
                String post = orTxt(it, "hmPostNo", "postNo");
                String detailAddr = orTxt(it, "detailAddr", "addr", "address");
                String address = (post != null && !post.isBlank() ? "(" + post + ") " : "")
                        + (detailAddr != null ? detailAddr : "");
                f.setAddress(address.isBlank() ? null : address);

                // 전화번호: 언더스코어 버전/노언더스코어 버전 모두 지원
                String p1 = orTxt(it, "locTelNo_1", "locTelNo1");
                String p2 = orTxt(it, "locTelNo_2", "locTelNo2");
                String p3 = orTxt(it, "locTelNo_3", "locTelNo3");
                f.setPhone(p1 != null && p2 != null && p3 != null ? p1 + "-" + p2 + "-" + p3 : null);

                out.add(f);
            }
            return out;
        });
    }
}
