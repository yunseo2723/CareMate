package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

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
