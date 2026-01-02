package me.hys.carematebackend.dto.recommend;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecommendResponse {

    private String query;
    private List<FacilityRecommend> results;

    @Getter @Setter
    public static class FacilityRecommend {
        private String instCode;
        private String kindCode;
        private String name;
        private String address;
        private String grade;
        private String avgRating;
        private String reviewCount;
        private Double score;
        private List<Reason> reasons;
    }

    @Getter @Setter
    public static class Reason {
        private String sentence;
        private Double score;
    }
}
