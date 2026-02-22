![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![Java](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot-green)
![Frontend](https://img.shields.io/badge/Frontend-Angular%20%7C%20TypeScript-red)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
# FleetFalcon 🚗🦅

### Enterprise Fleet Management System 
An enterprise-grade application designed to manage shared corporate vehicle fleets, handle employee bookings, and optimize resource allocation. This project serves as a deep dive into the **Full-Stack Enterprise Java Ecosystem**, implementing industry-standard architectural patterns and business logic.

## 🏗️ Architecture & Design

Controller-Service-Repository pattern.

* **Backend:** Java 17 with Spring Boot 4.0.2
* **Database:** PostgreSQL with Spring Data JPA (Hibernate)
* **Frontend:** Angular (SPA) - In Progress
* **Communication:** RESTful API (DTO pattern)

## 🎯 Features

### 1. Vehicle Inventory Management
* CRUD operations for fleet vehicles.
* Tracking metadata: Brand, Model, License plate, Type, and Daily Price.
* Real-time Availability: Automatic synchronization of vehicle availability based on active bookings.

### 2. Booking Lifecycle 
* **Conflict Detection:** Database-level logic (SQL/JPQL) to prevent overlapping reservations for the same vehicle.
* **Strict State Transitions:** A state machine ensuring logical progression: `PENDING` ➡️ `APPROVED` ➡️ `ACTIVE` ➡️ `COMPLETED` (along with `REJECTED` and `CANCELLED` states).
* **Check-out / Check-in System:** * Tracks starting and ending mileage.
  * Calculates total distance traveled dynamically.
  * Validates logic (e.g., end mileage cannot be less than start mileage; cannot cancel an active trip).

### 3. User Roles & Security (In progress)
* CRUD operations for employees.
* **Admin:** Full access to fleet management, booking approvals, and overriding bookings.
* **Employee:** Standard access to view availability and request vehicles.

## 🚀 Roadmap & Planned Features

While the core backend engine and state machine are functional, the system is actively being expanded with the following modules:

* **🖥️ Frontend Web Application:** * Developing a modern Single Page Application (SPA) using **Angular** and TypeScript.
    * Implementing a responsive "Fleet Dashboard" with real-time status indicators.
* **🛠️ Vehicle Maintenance Module:** * Tracking service intervals and repair logs.
    * Blocking vehicles during maintenance periods to prevent conflict in the booking engine.
* **📊 Reporting & Analytics:**
    * Generating usage and cost statistics.


## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Language** | Java 17, TypeScript |
| **Frameworks** | Spring Boot 3.x, Angular 17+ |
| **Data Access** | Spring Data JPA, Hibernate |
| **Database** | PostgreSQL |
| **Build Tools** | Maven, npm |
| **DevOps** | Docker, Docker Compose |
