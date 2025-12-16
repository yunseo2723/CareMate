package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.facility.FavoriteFacilityDto;
import me.hys.carematebackend.model.FavoriteFacility;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.FavoriteFacilityRepository;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteFacilityRepository favoriteRepo;
    private final UserRepository userRepo;
    private final LtcFacilityRepository ltcFacilityRepo;

    public boolean toggle(Long userId, String instCode, String kindCode) {

        Optional<FavoriteFacility> exist =
                favoriteRepo.findByUserIdAndInstCodeAndKindCode(
                        userId, instCode, kindCode
                );

        if (exist.isPresent()) {
            favoriteRepo.delete(exist.get());
            return false; // 해제됨
        }

        LtcFacility facility = ltcFacilityRepo
                .findByInstCodeAndKindCode(instCode, kindCode)
                .orElseThrow(() -> new RuntimeException("요양원 정보 없음"));

        FavoriteFacility fav = FavoriteFacility.builder()
                .user(userRepo.getReferenceById(userId))
                .instCode(instCode)
                .kindCode(kindCode)
                .name(facility.getName())
                .address(facility.getFullRoadNm())
                .createdAt(LocalDateTime.now())
                .build();

        favoriteRepo.save(fav);
        return true; // 즐겨찾기 등록
    }

    public boolean isFavorite(Long userId, String instCode, String kindCode) {
        return favoriteRepo.existsByUserIdAndInstCodeAndKindCode(
                userId, instCode, kindCode
        );
    }

    public List<FavoriteFacilityDto> myFavorites(Long userId) {
        return favoriteRepo.findByUserId(userId)
                .stream()
                .map(f -> new FavoriteFacilityDto(
                        f.getInstCode(),
                        f.getKindCode(),
                        f.getName(),
                        f.getAddress(),
                        f.getCreatedAt()
                ))
                .toList();
    }
}

