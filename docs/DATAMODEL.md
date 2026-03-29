# FleetFalcon Adatmodell

Az alkalmazás relációs adatbázist (PostgreSQL) használ, amely 5 entitásból áll.

## 1. User (Biztonság és Hitelesítés)
* **id** (Long) - Primary Key
* **email** (String) - Egyedi, felhasználónévként funkcionál a bejelentkezéshez
* **passwordHash** (String) 
* **role** (Enum) - `ADMIN`, `EMPLOYEE`

## 2. Employee (Üzleti Profil)
* **id** (Long) - Primary Key
* **user_id** - Foreign Key (1:1 kapcsolat)
* **employeeId** (String) - Céges azonosító
* **firstName** (String) 
* **lastName** (String) 
* **department** (String) 
* **phoneNumber** (String) 
* **drivingLicenseNumber** (String) - kötelező az autófoglaláshoz

## 3. Vehicle (Flotta Készlet)
* **id** (Long) - Primary Key
* **brand** (String) 
* **model** (String) 
* **licensePlate** (String) - Unique
* **vehicleType** (Enum) - `CAR`, `MINIVAN`, `VAN`, `BUS`, `MOTORCYCLE`, `TRUCK`, `OTHER`
* **fuelType** (Enum) - `PETROL`, `DIESEL`, `ELECTRIC`, `HYBRID`, `OTHER`
* **releaseYear** (Integer) 
* **dailyPrice** (Integer) 
* **seatingCapacity** (Integer) - A jármű hivatalos férőhelyeinek száma
* **description** (Text) - Szabad szöveges leírás a járműről (felszereltség, megjegyzés, egyéb információ)
* **status** (Enum) - `AVAILABLE`, `IN_USE`, `MAINTENANCE`, `OUT_OF_SERVICE`
* **currentMileage** (Integer) - Minden lezárt utazás után frissül, illetve az admin manuálisan frissítheti
* **inspectionValidUntil** (Date) - Műszaki érvényessége
* **nextServiceMileage** (Integer) - Következő kötelező szerviz kilométer határa. 
* **nextServiceDate** (Date) - Következő kötelező szerviz időpontja. 

Ezt az utóbbi 3-at az admin írhatja be szervíz után, és ha lejárnak, a rendszer blokkolja a járműveket

## 4. Booking 
A foglalás életciklusa és utazási adatok.
* **id** (Long) - Primary Key
* **employee_id** (Foreign Key) - N:1 kapcsolat
* **vehicle_id** (Foreign Key) - N:1 kapcsolat
* **startDate** (Timestamp) 
* **endDate** (Timestamp) 
* **status** (Enum) - `PENDING`, `APPROVED`, `ACTIVE`, `COMPLETED`, `REJECTED`, `CANCELLED`
* **startMileage** (Integer) - Check-outnál rögzítve
* **endMileage** (Integer) - Check-innél rögzítve, >= startMileage
* **distanceTraveled** (Integer) - Dinamikusan számolva
* **cost** (Integer)

## 5. MaintenanceLog
Megtörtént szervizelések
* **id** (Long) - Primary Key
* **vehicle_id** (Foreign Key) - N:1 kapcsolat
* **type** (Enum) - `ROUTINE_SERVICE`, `REPAIR`, `TIRE_CHANGE`
* **startDate** (Timestamp)
* **endDate** (Timestamp)
* **cost** (Integer)
* **description** (Text) - (Tervezett: Számlák/munkalapok fájlfeltöltése)