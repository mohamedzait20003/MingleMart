package com.minglemart.modules.catalog.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.catalog.dtos.LandingResponse;
import com.minglemart.modules.catalog.services.CategoryService;
import com.minglemart.modules.catalog.services.DealService;
import com.minglemart.modules.catalog.services.ProductService;
import com.minglemart.shared.common.ApiResponse;
import com.minglemart.shared.domain.BaseController;

/**
 * The home page, in one request: category tiles, the trending strip and the
 * headline offer. Public - a visitor sees the same storefront as a customer.
 *
 * <p>Composed here from the three services that own the parts, each of which
 * caches its own. That is deliberate: the department tiles are good for ten
 * minutes and the hero countdown for two, so caching them as one page payload
 * would throw away the stable half every time the volatile half expired.
 */
@RestController
@RequestMapping("/api/landing")
public class LandingController extends BaseController {

    private final CategoryService categories;
    private final ProductService products;
    private final DealService deals;

    public LandingController(CategoryService categories, ProductService products, DealService deals) {
        this.categories = categories;
        this.products = products;
        this.deals = deals;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<LandingResponse>> landing() {
        LandingResponse body = new LandingResponse(
                categories.tiles(),
                products.trending(),
                deals.dealOfTheDay().orElse(null));

        return ok("Landing loaded.", body);
    }
}
