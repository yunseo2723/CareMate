package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.model.FavoriteFacility;
import me.hys.carematebackend.model.community.FacilityPost;
import me.hys.carematebackend.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// controller/FavoriteController.java
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    /** ⭐ 토글 */
    @PostMapping("/{instCode}/{kindCode}")
    public ResponseEntity<?> toggle(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode
    ) {
        boolean result = favoriteService.toggle(
                cud.getUser().getId(), instCode, kindCode
        );
        return ResponseEntity.ok(Map.of("favorite", result));
    }

    /** ⭐ 상태 조회 */
    @GetMapping("/{instCode}/{kindCode}")
    public ResponseEntity<?> isFavorite(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode
    ) {
        return ResponseEntity.ok(
                Map.of("favorite",
                        favoriteService.isFavorite(
                                cud.getUser().getId(), instCode, kindCode))
        );
    }

    /** ⭐ 내 즐겨찾기 목록 */
    @GetMapping("/me")
    public ResponseEntity<?> myFavorites(
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        return ResponseEntity.ok(
                favoriteService.myFavorites(cud.getUser().getId())
        );
    }

}

