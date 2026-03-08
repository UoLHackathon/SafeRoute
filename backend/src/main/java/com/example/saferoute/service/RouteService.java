package com.example.saferoute.service;

import com.example.saferoute.dto.CoordinateDto;
import com.example.saferoute.dto.RouteRequest;
import com.example.saferoute.dto.RouteResponse;
import com.example.saferoute.enums.RouteMode;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    public RouteResponse calculateRoute(RouteRequest request) {
        RouteResponse response = new RouteResponse();
        response.setMode(request.getMode());

        if (request.getMode() == RouteMode.FASTEST) {
            response.setDistanceMeters(1200.0);
            response.setDurationSeconds(850.0);
            response.setRiskScore(60.0);
            response.setConfidence("MEDIUM");
            response.setReasons(List.of("Shortest travel time", "More direct route"));
            response.setPath(List.of(
                    new CoordinateDto(request.getStartLat(), request.getStartLong()),
                    new CoordinateDto(
                            midpoint(request.getStartLat(), request.getDestLat()) + 0.0008,
                            midpoint(request.getStartLong(), request.getDestLong()) + 0.0005
                    ),
                    new CoordinateDto(request.getDestLat(), request.getDestLong())
            ));
        } else if (request.getMode() == RouteMode.LOWER_RISK) {
            response.setDistanceMeters(1450.0);
            response.setDurationSeconds(980.0);
            response.setRiskScore(30.0);
            response.setConfidence("HIGH");
            response.setReasons(List.of("Fewer nearby incidents", "Closer to safe stops"));
            response.setPath(List.of(
                    new CoordinateDto(request.getStartLat(), request.getStartLong()),
                    new CoordinateDto(
                            midpoint(request.getStartLat(), request.getDestLat()) - 0.0010,
                            midpoint(request.getStartLong(), request.getDestLong()) + 0.0007
                    ),
                    new CoordinateDto(request.getDestLat(), request.getDestLong())
            ));
        } else {
            response.setDistanceMeters(1500.0);
            response.setDurationSeconds(1020.0);
            response.setRiskScore(35.0);
            response.setConfidence("MEDIUM");
            response.setReasons(List.of("Better lit route", "Busier roads"));
            response.setPath(List.of(
                    new CoordinateDto(request.getStartLat(), request.getStartLong()),
                    new CoordinateDto(
                            midpoint(request.getStartLat(), request.getDestLat()) + 0.0012,
                            midpoint(request.getStartLong(), request.getDestLong()) - 0.0008
                    ),
                    new CoordinateDto(request.getDestLat(), request.getDestLong())
            ));
        }

        return response;
    }

    private double midpoint(double a, double b) {
        return (a + b) / 2.0;
    }
}