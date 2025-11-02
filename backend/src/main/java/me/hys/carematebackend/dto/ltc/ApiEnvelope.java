package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.util.List;

/** 공공데이터 XML 공통 래퍼 */
@Data
public class ApiEnvelope<T> {
    private Response<T> response;

    @Data
    public static class Response<T> {
        private Header header;
        private Body<T> body;
    }

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body<T> {
        private String pageNo;
        private String totalCount;
        private String numOfRows;
        private Items<T> items;
    }

    @Data
    public static class Items<T> {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "item")
        private List<T> item;
    }
}
