package com.example.saferoute.dto;

public class WalkSessionDto {
    private String id;
    private String routeMode;
    private String startTime;
    private String expectedArrival;
    private boolean isActive;
    private String lastCheckIn;

    public WalkSessionDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRouteMode() { return routeMode; }
    public void setRouteMode(String routeMode) { this.routeMode = routeMode; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getExpectedArrival() { return expectedArrival; }
    public void setExpectedArrival(String expectedArrival) { this.expectedArrival = expectedArrival; }
    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
    public String getLastCheckIn() { return lastCheckIn; }
    public void setLastCheckIn(String lastCheckIn) { this.lastCheckIn = lastCheckIn; }
}
