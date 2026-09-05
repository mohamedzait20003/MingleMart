package com.minglemart.modules.catalog.controllers;

import java.util.List;
import java.math.BigDecimal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.shared.common.ApiResponse;
import com.minglemart.shared.domain.BaseController;
import com.minglemart.modules.catalog.dtos.ShopSort;
import com.minglemart.modules.catalog.dtos.ShopResponse;
import com.minglemart.modules.catalog.services.ProductService;

@RestController
@RequestMapping("/api/shop")
public class ShopController extends BaseController {

    private static final int DEFAULT_PAGE_SIZE = 12;

    private final ProductService products;

    public ShopController(ProductService products) {
        this.products = products;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ShopResponse>> shop(
        @RequestParam(required = false) String q,
        @RequestParam(name = "category", required = false) List<String> categories,
        @RequestParam(name = "min", required = false) BigDecimal minPrice,
        @RequestParam(name = "max", required = false) BigDecimal maxPrice,
        @RequestParam(name = "rating", required = false) BigDecimal minRating,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "" + DEFAULT_PAGE_SIZE) int size
    ) {
        BigDecimal low = minPrice;
        BigDecimal high = maxPrice;

        if (low != null && high != null && low.compareTo(high) > 0) {
            BigDecimal swap = low;
            low = high;
            high = swap;
        }

        BigDecimal rating = minRating == null || minRating.signum() <= 0 ? null : minRating;

        // Normalised before the call, because the service caches on these exact
        // arguments. ?category=a&category=b and ?category=b&category=a are one
        // query and must not become two cache entries; and BigDecimal.equals is
        // scale-sensitive, so "10" and "10.0" would be another needless split.
        List<String> tidyCategories = categories == null ? List.of()
                : categories.stream()
                        .filter(c -> c != null && !c.isBlank())
                        .map(String::trim)
                        .distinct()
                        .sorted()
                        .toList();

        ShopResponse body = products.shop(
            q == null || q.isBlank() ? null : q.trim(),
            tidyCategories,
            scale(low),
            scale(high),
            scale(rating),
            ShopSort.from(sort),
            Math.max(page, 1),
            Math.clamp(size, 1, MAX_PAGE_SIZE)
        );

        return ok("Shop loaded.", body);
    }

    /** Strips trailing zeros so 10 and 10.0 are one cache key, not two. */
    private static BigDecimal scale(BigDecimal value) {
        return value == null ? null : value.stripTrailingZeros();
    }
}
