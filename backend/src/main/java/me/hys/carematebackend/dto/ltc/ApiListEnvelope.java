package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

import java.util.List;

/**
 * 목록 API 공통 래퍼
 *
 * 실제 XML:
 * <response>
 *   <header>...</header>
 *   <body>
 *     <pageNo>...</pageNo>
 *     <totalCount>...</totalCount>
 *     <numOfRows>...</numOfRows>
 *     <items>
 *       <item>...</item>
 *       <item>...</item>
 *     </items>
 *   </body>
 * </response>
 */
@Data
@JacksonXmlRootElement(localName = "response")
public class ApiListEnvelope<T> {

    private Header header;
    private ListBody<T> body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class ListBody<T> {

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
