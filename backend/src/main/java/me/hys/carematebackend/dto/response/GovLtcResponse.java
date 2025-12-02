package me.hys.carematebackend.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * Root DTO for getLtcInsttSeachList02 API (JSON)
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GovLtcResponse {

    private GovResponse response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GovResponse {
        private GovHeader header;
        private GovBody body;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GovHeader {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GovBody {
        private int pageNo;
        private int totalCount;
        private int numOfRows;
        private GovItems items;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GovItems {
        private List<GovLtcItem> item;
    }
}
