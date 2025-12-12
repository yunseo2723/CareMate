package me.hys.carematebackend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.filter.SavedFilterDto;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.model.SavedFilter;
import me.hys.carematebackend.repository.SavedFilterRepository;
import me.hys.carematebackend.service.FilterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filters")
public class SavedFilterController {

    private final FilterService filterService;
    private final SavedFilterRepository repository;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> createFilter(
            @AuthenticationPrincipal CustomUserDetails cud,
            @RequestBody Map<String, Object> req
    ) throws JsonProcessingException {

        Long userId = cud.getUser().getId();
        String name = (String) req.get("name");

        Object filterObj = req.get("filter");
        String filterJson = objectMapper.writeValueAsString(filterObj);

        var saved = filterService.saveFilter(userId, name, filterJson);

        return ResponseEntity.ok(
                Map.of(
                        "id", saved.getId(),
                        "message", "saved"
                )
        );
    }

    @GetMapping
    public ResponseEntity<?> getMyFilters(
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        Long userId = cud.getUser().getId();

        var list = filterService.getMyFilters(userId)
                .stream()
                .map(SavedFilterDto::from)
                .toList();

        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable Long id,
            @RequestBody Map<String, Object> req
    ) throws JsonProcessingException {

        SavedFilter f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("필터 없음"));

        if (!f.getUser().getId().equals(cud.getUser().getId()))
            throw new AccessDeniedException("권한 없음");

        if (req.containsKey("name"))
            f.setName((String) req.get("name"));

        if (req.containsKey("filter"))
            f.setFilterJson(objectMapper.writeValueAsString(req.get("filter")));

        repository.save(f);

        return ResponseEntity.ok(SavedFilterDto.from(f));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable Long id
    ) {
        SavedFilter f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("필터 없음"));

        if (!f.getUser().getId().equals(cud.getUser().getId()))
            throw new AccessDeniedException("권한 없음");

        repository.delete(f);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }
}

