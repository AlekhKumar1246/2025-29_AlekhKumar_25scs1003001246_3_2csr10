# LastKM — AI-Powered Backhaul Matching for Community Good

## 1M1B | AI for Sustainability Virtual Internship

### Student Details

- **Name:** ALEKH KUMAR
- **Roll Number:** 25SCS1003001246
- **Program:** B.Tech CSE (AIML)
- **Semester:** 3rd
- **Section:** 2CSE10
- **University:** IILM University, Greater Noida, U.P.
- **Session:** 2025-29

## Project Overview

LastKM is an AI-powered backhaul matching concept designed to connect empty-return delivery trips with nearby community transport needs.

The idea is to use available space in delivery vehicles that are already returning along a route instead of creating a separate delivery trip. This can help drivers earn additional income while providing affordable transport for small community deliveries.

The project focuses on sustainable and inclusive urban logistics and is aligned with:

- **SDG 11 — Sustainable Cities**
- **SDG 12 — Responsible Consumption**

## Problem Statement

Delivery vehicles may return after completing their deliveries without carrying additional goods. At the same time, students, individuals, shopkeepers and NGOs may need affordable transport for small deliveries.

LastKM proposes an AI-assisted matching system to connect these two needs.

### Challenge

> How might AI be used to match empty-return delivery trips with local community transport needs so that urban logistics become more sustainable and inclusive?

## Proposed Solution

LastKM matches suitable community delivery requests with available backhaul capacity.

The matching process considers:

1. **Route compatibility** — pickup and drop locations should fit within the driver's route.
2. **Capacity compatibility** — the requested items should fit within the available vehicle space.
3. **Time-window compatibility** — the delivery request should overlap with the driver's available time.
4. **Fair pricing** — a suggested backhaul price is calculated to provide value to both the sender and driver.
5. **Live tracking** — the delivery workflow includes live tracking and an estimated arrival time.
6. **Trust and safety** — package declaration and two-way ratings are included in the concept.

## Prototype

The LastKM prototype demonstrates a browser-based AI matching engine.

The prototype allows a driver to:

- Register a start and end sector.
- Select available vehicle capacity.
- Select an operating time window.
- Scan nearby community requests.
- View matched and unmatched requests.
- See why a request matched or did not match.
- View the suggested price.
- Accept a matched request.
- Track the delivery.
- Complete the delivery.
- Rate the trip.

## Matching Logic

The prototype checks three main conditions:

### 1. Route Fit

The pickup and drop sectors must fall within the driver's route range.

### 2. Capacity Fit

The requested number of boxes must not exceed the available vehicle capacity.

### 3. Time Fit

The community request's time window must overlap with the driver's available time window.

A request is considered a match only when all three conditions are satisfied.

## Pricing

The prototype calculates a suggested backhaul price based on the estimated dedicated-delivery cost.

The pricing model also separates:

- Base fuel and time cost
- Driver incentive margin
- Suggested backhaul price
- Estimated saving compared with a dedicated delivery

This is intended to create a transparent pricing experience rather than presenting only an unexplained price.

## Responsible AI

The project considers responsible-AI principles including:

- **Fairness:** Consistent matching and pricing rules.
- **Transparency:** Showing users why a request matched and how the price was calculated.
- **Safety:** Restricting the current concept to declared, non-restricted and non-perishable items.
- **Privacy:** Limiting live location sharing to the active delivery period.

## Expected Impact

### Economic Impact

- Additional earning opportunities for delivery drivers.
- Lower delivery costs for community users.

### Social Impact

- Affordable local transport for students, individuals, shopkeepers and NGOs.
- Better access to small-scale delivery services.

### Environmental Impact

- Better utilization of existing delivery trips.
- Potential reduction in unnecessary empty vehicle travel.
- Potential reduction in associated fuel consumption and emissions.

## Scope

The current project focuses on small-to-medium, non-perishable community deliveries such as:

- Books
- Clothes
- Stationery
- Dry goods
- Similar community supplies

Cold-chain and temperature-sensitive transportation is outside the current scope.

## Future Scope

Future development could include:

- Real map and route integration.
- Real-time traffic-aware ETA.
- Verified driver and user identities.
- Secure online payments.
- Improved vehicle capacity estimation.
- More advanced AI-based matching.
- Larger-scale community deployment.
- Measurement of actual fuel, distance and emissions savings.
- A separate certified cold-chain system for temperature-sensitive items.

## Internship

This project was developed as part of the:

**1M1B | AI for Sustainability Virtual Internship**

The internship was offered by **1M1B in collaboration with AICTE and co-certified by IBM SkillsBuild**.

The internship focused on AI, emerging technologies and sustainability-related challenges.

## Project Status

The project is being developed as part of the internship project submission phase.

The final internship completion certificate will be added to this repository after the final project completion and certification process.

## Repository Contents

This repository contains the documentation and project materials for the LastKM internship project.

Planned files include:

- `README.md` — Project documentation
- `Internship_PPT.pptx` — Internship project presentation
- `Internship_Report.docx` — Internship report
- `Internship_Certificate.pdf` — Internship certificate
- `LastKM` — Project prototype/source files

## Author

**ALEKH KUMAR**

B.Tech CSE (AIML)  
IILM University, Greater Noida, U.P.

**Roll Number:** 25SCS1003001246  
**Section:** 2CSR10  
**Semester:** 3rd
