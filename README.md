# SafeRoute

SafeRoute is a safety-focused navigation application designed to help users—particularly women—make more informed decisions when walking through cities.

Traditional navigation apps such as Google Maps optimize routes primarily for speed or distance. SafeRoute  introduces risk-aware routing, considering contextual safety factors like lighting conditions, incident reports, isolation levels, and nearby public services.

The goal is not to guarantee safety, but to provide decision-support tools that reduce exposure to known risk factors.

Problem

Many people, especially women walking alone at night, must constantly evaluate safety when navigating urban environments.

Examples include:

avoiding poorly lit streets

avoiding isolated shortcuts

staying near populated areas

knowing where help is available nearby

Existing navigation platforms do not integrate these safety considerations directly into route recommendations.

Solution

SafeRoute  generates lower-risk route suggestions by analyzing environmental safety signals and user-reported incidents.

Instead of labeling locations as “safe,” the system provides:

relative risk scores

contextual explanations

confidence indicators based on available data

This approach avoids false guarantees while helping users make more informed navigation decisions.

Key Features
Safety-Aware Routing

Users can choose between:

Fastest Route

Lower-Risk Route

Comfort Route (better lighting and busier areas)

Routes are scored using contextual safety signals.

Confidence Indicator

Every route includes a confidence level based on data availability and freshness.

Example:

Lower Risk — High Confidence

Lower Risk — Limited Data

Safe Stops

The map highlights nearby locations where help may be available:

pharmacies

hospitals

police stations

transit hubs

late-open shops

These serve as potential support locations if a user feels unsafe.

Check-In Timer

Users can start a walk session and set an expected arrival time.

If the user fails to check in after arrival, a trusted contact can receive a location alert.

Incident Reporting

Users can submit quick safety reports, such as:

harassment

suspicious activity

poorly lit streets

isolated areas

Reports are aggregated and anonymized to improve route safety scoring.

## Tech Stack
# Frontend

React

Mapbox GL JS

# Backend

Spring Boot

REST API architecture

Database & Auth

Supabase

PostgreSQL database

real-time data updates

# Routing

Mapbox Directions API

Architecture
React Frontend
       ↓
REST API
       ↓
Spring Boot Backend
       ↓
Safety Scoring Engine
       ↓
Supabase PostgreSQL
       ↓
Mapbox Directions API

Example Safety Model

Route risk is calculated using environmental signals:

Route Risk Score =
0.35 * incident density
+ 0.25 * poor lighting
+ 0.20 * isolation score
+ 0.10 * harassment reports
- 0.10 * nearby open venues

Lower scores represent lower-risk routes.

Ethical Design

SafeRoute  does not profile individuals or assume the identity of perpetrators.

The system evaluates environmental risk signals and aggregated incident data to generate route recommendations. This approach prioritizes privacy, reduces bias, and avoids creating misleading “safe zone” guarantees.

Future Improvements

-based lighting detection from street images

real-time crowd density estimation

predictive safety scoring based on time of day

mobile app version

smart wearable safety integration

License

This project is licensed under the MIT License.
