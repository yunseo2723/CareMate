package me.hys.carematebackend.spec;

import me.hys.carematebackend.model.CareMate;
import org.springframework.data.jpa.domain.Specification;

public final class CareMateSpecs {
    private CareMateSpecs() {}

    public static Specification<CareMate> regionContains(String region){
        return (root, q, cb) -> (region == null || region.isBlank()) ? null
                : cb.like(root.get("region"), "%" + region + "%");
    }

    public static Specification<CareMate> feeLte(Integer budgetMax){
        return (root, q, cb) -> (budgetMax == null) ? null
                : cb.le(root.get("monthlyFeeMin"), budgetMax);
    }

    public static Specification<CareMate> specialtyHas(String keyword){
        return (root, q, cb) -> (keyword == null || keyword.isBlank()) ? null
                : cb.isMember(keyword, root.get("specialties")); // ElementCollection
    }
}
