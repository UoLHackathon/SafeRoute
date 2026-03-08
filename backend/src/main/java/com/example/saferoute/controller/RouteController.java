package com.example.saferoute.controller;


import com.example.saferoute.dto.RouteRequest;
import com.example.saferoute.dto.RouteResponse;
import com.example.saferoute.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/calculate")
    public RouteResponse calculateRoute(@Valid @RequestBody RouteRequest routeRequest) {
        return routeService.calculateRoute(routeRequest);
    }
}
