package com.minglemart.modules.catalog.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.catalog.dtos.DealsResponse;
import com.minglemart.modules.catalog.services.DealService;
import com.minglemart.shared.common.ApiResponse;
import com.minglemart.shared.domain.BaseController;

/**
 * The deals page: what is discounted right now, split into the headline strip
 * and the browsable grid, with the totals the hero counts down against.
 *
 * <p>Only campaign-backed offers appear. A standalone markdown still prices the
 * product everywhere else, it just is not a "deal" a shopper can be sent to.
 */
@RestController
@RequestMapping("/api/deals")
public class DealsController extends BaseController {

    private final DealService deals;

    public DealsController(DealService deals) {
        this.deals = deals;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DealsResponse>> deals() {
        return ok("Deals loaded.", deals.dealsPage());
    }
}
