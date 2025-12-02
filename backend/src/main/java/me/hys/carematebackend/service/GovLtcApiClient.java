package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.hys.carematebackend.dto.response.GovLtcItem;
import me.hys.carematebackend.dto.response.GovLtcResponse;
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

    /**
     * Fetch all LTC facilities in a sido region
     */
    public List<GovLtcItem> fetchFacilitiesBySido(String sidoCd) {

        UriComponentsBuilder b = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/B550928/searchLtcInsttService02/getLtcInsttSeachList02")
                .queryParam("serviceKey", serviceKey)
                .queryParam("siDoCd", sidoCd)
                .queryParam("numOfRows", 10000)
                .queryParam("_type", "json");

        URI url = b.build(true).toUri();
        log.info("Calling Gov LTC API: {}", url);

        GovLtcResponse response = restTemplate.getForObject(url, GovLtcResponse.class);

        if (response == null ||
                response.getResponse() == null ||
                response.getResponse().getBody() == null ||
                response.getResponse().getBody().getItems() == null) {

            log.error("❌ Invalid or null response from Gov API (sido={})", sidoCd);
            return Collections.emptyList();
        }

        List<GovLtcItem> items = response.getResponse().getBody().getItems().getItem();

        if (items == null) {
            log.warn("⚠ Gov API returned empty list for sido={}", sidoCd);
            return Collections.emptyList();
        }

        log.info("✔ Gov API returned {} facilities for sido={}", items.size(), sidoCd);
        return items;
    }
}