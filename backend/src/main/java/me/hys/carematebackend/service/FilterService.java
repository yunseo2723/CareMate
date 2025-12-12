package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.filter.SavedFilterDto;
import me.hys.carematebackend.model.SavedFilter;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.SavedFilterRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// service/FilterService.java
@Service
@RequiredArgsConstructor
public class FilterService {

    private final SavedFilterRepository savedFilterRepository;
    private final UserRepository userRepository;

    public SavedFilter saveFilter(Long userId, String name, String filterJson) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        SavedFilter f = new SavedFilter();
        f.setName(name);
        f.setFilterJson(filterJson);
        f.setUser(user);
        f.setCreatedAt(LocalDateTime.now());

        return savedFilterRepository.save(f);
    }

    public List<SavedFilter> getMyFilters(Long userId) {
        return savedFilterRepository.findByUserId(userId);
    }
}
