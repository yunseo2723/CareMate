package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.ltc.GovLtcItem;
import me.hys.carematebackend.dto.ltc.GovLtcResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GovLtcApiClient {

    @Value("${ltc.api.serviceKey}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /** 개별 시도 조회 **/
    public List<GovLtcItem> fetchFacilitiesBySido(String sidoCd) {

        UriComponentsBuilder b = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/B550928/searchLtcInsttService02/getLtcInsttSeachList02")
                .queryParam("serviceKey", serviceKey)
                .queryParam("siDoCd", sidoCd)
                .queryParam("numOfRows", 30000)
                .queryParam("pageNo", 1)
                .queryParam("_type", "json");

        URI url = b.build(true).toUri();
        log.info("📡 Gov API 호출 (sido={}) → {}", sidoCd, url);

        GovLtcResponse response = restTemplate.getForObject(url, GovLtcResponse.class);

        if (response == null ||
                response.getResponse() == null ||
                response.getResponse().getBody() == null ||
                response.getResponse().getBody().getItems() == null) {

            log.error("❌ Invalid response for sido={}", sidoCd);
            return Collections.emptyList();
        }

        List<GovLtcItem> items = response.getResponse().getBody().getItems().getItem();

        if (items == null || items.isEmpty()) {
            log.warn("⚠ Empty list for sido={}", sidoCd);
            return Collections.emptyList();
        }

        log.info("✔ sido={} 시설 {}개", sidoCd, items.size());
        return items;
    }
}
