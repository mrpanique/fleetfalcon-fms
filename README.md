![Status](https://img.shields.io/badge/Status-Inital%20development%20phase-orange)
![Java](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot-green)
![Frontend](https://img.shields.io/badge/Frontend-Angular%20%7C%20TypeScript-red)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
# FleetFalcon 🚗🦅

### Enterprise Fleet Management System 
An enterprise-grade application designed to manage corporate vehicle fleets, handle employee bookings, and optimize resource allocation. This project serves as a deep dive into the **Full-Stack Enterprise Java Ecosystem**, implementing industry-standard architectural patterns.

## 🏗️ Architecture & Design

The system follows a strict **N-Tier Architecture** to ensure separation of concerns and scalability:

* **Backend:** Java 17 with Spring Boot 3.x
* **Database:** PostgreSQL with Spring Data JPA (Hibernate)
* **Frontend:** Angular (SPA) with Material Design components
* **Communication:** RESTful API

### Core Architectural Layers
1.  **Controller Layer:** Handles HTTP requests and response mapping (DTO pattern).
2.  **Service Layer:** Contains the core business logic.
3.  **Repository Layer:** Abstracts database interactions.

## 🎯 Features (Planned & In Progress)

### 1. Vehicle Inventory Management
* CRUD operations for fleet vehicles (Cars, Vans).
* Tracking metadata: License plate, VIN, Status (Available/In Service/Retired/Planned).

### 2. Booking System
* **Conflict Detection:** An algorithm to prevent overlapping reservations for the same vehicle.
* **Validation:** Ensuring booking dates are logical and adhere to business rules.
* **User Assignment:** Linking vehicles to specific employees for defined periods.
* **Approval:** An admin has to approve the employee's request to book a vehicle.

### 3. User Roles & Security
* **Admin:** Full access to fleet management and overriding bookings.
* **Employee:** Standard access to view availability and request vehicles.

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Language** | Java 17, TypeScript |
| **Frameworks** | Spring Boot 3.x, Angular 17+ |
| **Data Access** | Spring Data JPA, Hibernate |
| **Database** | PostgreSQL |
| **Build Tools** | Maven, npm |
| **DevOps** | Docker, Docker Compose |
