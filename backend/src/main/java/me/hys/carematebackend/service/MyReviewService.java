package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.MyReviewDto;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.model.community.FacilityPost;
import me.hys.carematebackend.repository.FacilityPostRepository;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyReviewService {

    private final FacilityPostRepository postRepository;
    private final LtcFacilityRepository facilityRepository;

    public List<MyReviewDto> getMyReviews(Long userId) {

        List<FacilityPost> posts = postRepository.findMyReviews(userId);

        return posts.stream().map(p -> {
            String facilityName =
                    facilityRepository.findByInstCodeAndKindCode(
                            p.getInstCode(), p.getKindCode()
                    ).map(LtcFacility::getName).orElse("");

            return new MyReviewDto(
                    p.getId(),
                    p.getInstCode(),
                    p.getKindCode(),
                    facilityName,
                    p.getTitle(),
                    p.getRating(),
                    p.getCreatedAt(),
                    p.getViewCount()
            );
        }).toList();
    }
}

