FMS FEJLESZTÉSI PROMPTOK - AI ITERÁCIÓS NAPLÓ

PONT 1: ADATMODELL TERVEZÉS

Prompt: Tervezd meg a PostgreSQL sémát User, Employee, Vehicle, Booking, MaintenanceLog entitásokhoz. Enum típusokat, relációkat, booking státusz lifecycle-t.

AI válasz: 5 entitás Foreign Key-kkel, enum javaslatai, PENDING > APPROVED > ACTIVE > COMPLETED flow.

Kezelés: Rendben volt, de az ACTIVE státusz csak később merült fel teljesen. A PENDING nem volt teljesen tiszta az elején, hogyan működik a foglalás logika mellett.

---

PONT 2: USER, EMPLOYEE, VEHICLE ENTITÁSOK

Prompt: Generáld le a User.java, Employee.java, Vehicle.java JPA kódot. @Entity, @Table, enum @Enumerated, @OneToOne/@OneToMany.

AI válasz: Helyes annotációk, relációs mappingek, enum beágyazás.

Később: Az AI @JsonIgnore-t rakott a passwordHash-re, ami az autentikáció szétszedésre vezetett. A JsonIgnore mindkét irányú szerializációt letiltja, így POST /login requestből nem parse-oldódott be a jelszó. Javítás: @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) használata.

---

PONT 3: BOOKING SERVICE ÉS CONTROLLER

Prompt: Implementáld a BookingService-t: createBooking, getBookingsByEmployee, updateBookingStatus, cancelBooking. Ütközésdetekciót oldd meg.

AI válasz: Service osztály, dependency injection, overlapping bookings query, REST végpontok.

Kezelés: Az ütközésdetekcit JPQL query-vel csinálta, de a PENDING státuszt nem vette figyelembe, mert "a PENDING foglalást az alkalmazott lemondhatja". Ez nyilván hülyeség. Javítás: APPROVED, PENDING és ACTIVE blokkoljon.

---

PONT 4: DESIGN TOKEN RENDSZER

Prompt: Tailwind CSS + CSS variable design token rendszer. Color palette, spacing scale, typography, shadows. tailwind.config.js-ben.

AI válasz: Comprehensive theme object, CSS custom properties, responsive utilities.

Kezelés: Elfogadva. Ez az első UI-t megelőzően kellett megtörténnie, hogy konzisztens legyen az egész frontend.

---

PONT 5: EMPLOYEE DASHBOARD, VEHICLE SEARCH, CREATE BOOKING

Prompt: 3 komponens az alkalmazottaknak: EmployeeDashboardPage (aktív/korábbi foglalások), VehicleSearchPage (szűrés típus/ár/dátum), CreateBookingPage. Tailwind, Angular standalone components.

AI válasz: Dashboard table, search grid, form, FilterPanel.

Kezelés: Rendben, de pl. a szabad dátum szűrő overlappelt, kilógott a helyéről. Az error messages kezelése sem volt elég robusztus. UI tweaks szükségesek voltak.

---

PONT 6: ADMIN EMPLOYEE MANAGEMENT

Prompt: Admin panel: EmployeesPage (tábla, search, sort, paginate), EmployeeCreatePage (form), EmployeeEditPage. Validáció, toast notifikációk.

AI válasz: Táblázat, Reactive Forms, Modal dialógus, HTTP service hívások.

Kezelés: Elfogadva.

---

PONT 7: ADMIN VEHICLE MANAGEMENT

Prompt: Admin panel: VehiclesPage (flotta, status filter), VehicleCreatePage (brand, model, licensePlate, type, fuel, price, seating, description), VehicleEditPage, VehicleMaintenancePage (szerviz naplók, currentMileage). Unique licensePlate, currentMileage >= 0.

AI válasz: Táblázat status badge-ekkel, create/edit formok, maintenance form, modal navigáció.

Kezelés: Elfogadva.

---

PONT 8: MILEAGE TRACKING - CHECK-OUT/CHECK-IN

Prompt: Check-out után (APPROVED -> ACTIVE): startMileage rögzítés. Check-in után (COMPLETED): endMileage rögzítés. Validáció: endMileage >= startMileage. Automatikus: distanceTraveled = endMileage - startMileage. Vehicle.currentMileage frissítés. /bookings/{id}/check-in endpoint.

AI válasz: CheckinRequest DTO, BookingService.checkInBooking(), validáció logika, Vehicle.currentMileage update.

Kezelés: Elfogadva. A mileage correction (admin korrigálás) és audit trail még nem volt benne, később kellett hozzáadni.

---

PONT 9: MAINTENANCE MODULE

Prompt: Admin: MaintenanceLog (type: ROUTINE_SERVICE, REPAIR, TIRE_CHANGE; startDate, endDate, cost, description). Ha Vehicle MAINTENANCE státuszban van, nem lehet rá booking. Szerviz után admin állítja vissza AVAILABLE-re. POST /vehicles/{id}/maintenance és GET /vehicles/{id}/maintenance-logs.

AI válasz: MaintenanceLog entitás, repository, VehicleService logika, MAINTENANCE státusz ellenőrzés, REST végpontok.

Kezelés: Elfogadva.

---

PONT 10: ÖSSZEFOGLALÁS ÉS KÖVETKEZŐ LÉPÉSEK

Prompt: Rövid összefoglaló és 3 következő lépés: mi a legfontosabb, amit most meg kell csinálni?

AI válasz: Validáció és hibakezelés tervben van, de prioritást kell adni. Legfontosabbak: (1) autentikációs flow tesztelése, (2) booking státuszok és ütközéslogika ellenőrzése, (3) design token rendszer véglegesítése a frontendhez.

Kezelés: Átírtam rövidebbre. Következő feladatok: teszteld az auth flow-t, javítsd a booking ütközésfeltételeket (APPROVED/ACTIVE), és véglegesítsd a design tokeneket.

---

TANULSÁGOK

Az AI sokszor pár prompt után elfelejti amit az elején specifikál neki az ember, így jobb inkább minden prompt-ba beleírni (pl UI design-nál az accessibility dolgokat egy idő után abbahagyta)

Sokszor elfelejt/kihagy dolgokat (legyen az teljes funkció, vagy egy lehetséges eset), lehet, hogy scope-on kívülinek gondolja, de erről nem szól, így a fejlesztő megszívhatja.
pl.:
ACTIVE státusz hiánya: Az AI a booking flow-t így javasolta: PENDING > APPROVED > COMPLETED. Az ACTIVE státusz csak később merült fel, amikor a check-out/check-in workflow lett világos. Az AI nem szimulálta végig a teljes lifecycle-t.

Design inconsistency: Az AI az első pár UI oldalnál Tailwind class-okat használt, később átváltott saját CSS-re.

Function creep: Sok funkció csak akkor jött a képbe, mikor már a UI-t csináltuk, mert előtte sem nekem, sem az AI-nak nem jutott eszébe. Így a UI után nagyon nagy ráncfelvarrás kellett a félkész backend-re.

Fejlesztési fázisok: Nem egy big-bang prompt volt. Körülbelül 60-70 prompt volt összesen: tervezés (3-5), backend core (5-8), frontend UI (20-25), integráció (10-15), finomítás (15-20). Minden fázisban volt iteráció és javítás.

Best practices: Kisebb promptok jobban működnek, mint a nagy-nagy lések. Domain knowledge az AI-ből hiányzik, szituációkat kell szimulálni. Design system-t kőbe kell neki vésni, komponensek csak utána. MVP scope-ra kell figyelni (scope creep kerülése). Konkrét teszt szituációkban validálni az AI output-ot.