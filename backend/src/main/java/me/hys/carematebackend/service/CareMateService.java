package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.caremate.CareMateCardRes;
import me.hys.carematebackend.dto.caremate.CareMateDetailRes;
import me.hys.carematebackend.mapper.CareMateMapper;
import me.hys.carematebackend.model.CareMate;
import me.hys.carematebackend.repository.CareMateRepository;
import me.hys.carematebackend.spec.CareMateSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CareMateService {
    private final CareMateRepository repo;

    public Page<CareMateCardRes> list(String region, Integer budgetMax, String specialty,
                                      Double userLat, Double userLng,
                                      Pageable pageable) {

        Specification<CareMate> spec = Specification.where(CareMateSpecs.regionContains(region))
                .and(CareMateSpecs.feeLte(budgetMax))
                .and(CareMateSpecs.specialtyHas(specialty));

        Page<CareMate> page = repo.findAll(spec, pageable);

        // 거리 계산(선택): 위경도 제공 시 메모리에서 계산
        return page.map(e -> {
            Double d = (userLat != null && userLng != null && e.getLat()!=null && e.getLng()!=null)
                    ? haversineKm(userLat, userLng, e.getLat(), e.getLng())
                    : null;
            return CareMateMapper.toCard(e, d);
        });
    }

    public CareMateDetailRes detail(Long id) {
        CareMate e = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CareMate not found"));
        return CareMateMapper.toDetail(e);
    }

    // Haversine (간단)
    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0088;
        double dLat = Math.toRadians(lat2-lat1);
        double dLon = Math.toRadians(lon2-lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        return 2*R*Math.asin(Math.sqrt(a));
    }
}
