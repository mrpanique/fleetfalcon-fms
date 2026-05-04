FEJLESZTÉSI PROMPTOK DOKUMENTÁLÁSA

1. Projekt inicializálása - Adatmodell tervezés

Prompt:
Tervezz egy PostgreSQL adatmodellt (DATAMODEL.md) egy gépjárműflotta-kezelő rendszerhez. Szükségesek felhasználók (admin, alkalmazott), járművek, foglalások, és karbantartási naplók. A foglalások ne engedjenek átfedést ugyanarra a járműre.

AI Válasz:
- Javasolt 5 fő entitást: User, Employee, Vehicle, Booking, MaintenanceLog
- Included Foreign Keys és relációs sémát
- Javasolt státuszok (AVAILABLE, IN_USE, MAINTENANCE, OUT_OF_SERVICE)
- Foglalási státusz gépállapot javaslattal: PENDING > APPROVED > ACTIVE > COMPLETED

Állapot: ELFOGADVA
Indoklás: A javaslat teljes körűen megvalósítva lett a projekt alapjául.


---

2. Backend arquitectúra - Controller-Service-Repository pattern

Prompt:
Javasolj egy Java Spring Boot alapú backend architektúrát az FMS-hez. Implementáld a Controller-Service-Repository pattern-t. Hogyan kezeljem az ütközésdetekciót a foglalásokkor?

AI Válasz:
- Ajánlott @RestController, @Service, @Repository layer-ek szétválasztása
- JPQL/SQL query javasolt az ütközésdetekció számára:
  SELECT COUNT(b) FROM Booking b 
  WHERE b.vehicle.id = :vehicleId 
  AND b.status IN (PENDING, APPROVED, ACTIVE)
  AND ((b.startDate < :endDate AND b.endDate > :startDate))
- DTO pattern bevezetése a JSON transzformációhoz
- Exception handling javasolt (custom BookingConflictException)

Állapot: ELFOGADVA
Indoklás: Teljes implementáció megtörtént, az ütközésdetekció backend szintű validáció alkalmazott.


---

3. Frontend alapok - Angular routing és guards

Prompt:
Készíts egy Angular SPA szerkezetet az FMS-hez. Szükséges szerepkör-alapú hozzáféréskezelés (Admin vs Employee). Hogyan implementáljak RoleGuard-ot?

AI Válasz:
- Javasolt AuthGuard és RoleGuard implementáció a CanActivate interfészen keresztül
- Routing struktura javasolt: /admin/*, /employee/*, /login, /public/*
- localStorage-ben token tárolása (JWT javaslat)
- Role checking a guard-ban: route.data['roles'] array checking

Állapot: ELFOGADVA
Indoklás: A javasolt guard struktura teljes mértékben implementálásra került.


---

4. Booking státusz gépállapot - State machine logika

Prompt:
Implementáljunk egy booking státusz gépállapotot: PENDING > APPROVED > ACTIVE > COMPLETED. Mi a teendő akkor, ha egy már APPROVED foglalásra új PENDING jön vissza? Kezeljem a REJECTED és CANCELLED állapotokat is.

AI Válasz:
- State machine diagramm javasolt, amely az összes lehetséges tranzíciót mutatja
- PENDING-ből: APPROVED vagy REJECTED
- APPROVED-ből: ACTIVE vagy CANCELLED
- ACTIVE-ből: COMPLETED vagy CANCELLED (ritkán)
- Javasolt enum-based validator az illegal state transitions blokkolására
- Metódus: isValidTransition(BookingStatus from, BookingStatus to)

Állapot: ELFOGADVA MÓDOSÍTÁSSAL
Indoklás: Az alaplogika elfogadva lett, de a terv módosult: CANCELLED állapot az APPROVED vagy ACTIVE állapotból is lehetséges (korábban csak APPROVED-ből terveztük).


---

5. Mileage tracking - Check-out/Check-in rendszer

Prompt:
A foglalások check-out és check-in szakaszaiban rögzítjük a kilométeróra állást. Validációk: a végállás >= kezdőállás, majd automatikus distanceTraveled számítás. Hogyan kezeljük azt, ha egy admin hibásan rögzít?

AI Válasz:
- Check-out során: startMileage lezárásra kerül, nem módosítható
- Check-in során: endMileage rögzítése, validáció: endMileage >= startMileage
- Dinamikus számítás: distanceTraveled = endMileage - startMileage
- Admin korrekció: új validation endpoint: PATCH /bookings/{id}/mileage-correction (audit trail-lel)
- Megjegyzés: currentMileage a Vehicle entitáson is frissülni kell

Állapot: ELFOGADVA MÓDOSÍTÁSSAL
Indoklás: Az alapfunkció elfogadva lett. A mileage-correction endpoint bevezetése előkészítésre kerül a jövőbeni verziókban (v1.1 tervezett).


---

6. Frontend UI komponensek - Tailwind CSS design

Prompt:
Tervezz egy Tailwind CSS alapú UI komponenseket az alkalmazottaknak szóló 'Jármű Keresés és Foglalás' oldalhoz. Szükséges: szűrés típus/ár/szabad dátum szerint, kártya layout, status indicator (Available/In Use).

AI Válasz:
- Component szerkezet: VehicleListPage > VehicleCard + FilterPanel
- Tailwind classes: grid layout (grid-cols-3), card styling (rounded-lg shadow-md)
- Filter UI: dropdown/multi-select Tailwind komponensek (custom vagy daisyUI)
- Status Indicator: color-coded badge (bg-green-500, bg-red-500, bg-yellow-500)
- Responsive design: md:grid-cols-2 lg:grid-cols-3
- Sorrendiség: debounced search + live filter

Állapot: ELFOGADVA
Indoklás: Komponensek implementálásban, a FilterPanel és VehicleCard már funkcióális.


---

7. Karbantartási modul - Szerviz naplózás és blokkolás

Prompt:
Implementálj egy karbantartási modult az adminisztrátoroknak. Lehetőségek: szerviztípus (ROUTINE_SERVICE, REPAIR, TIRE_CHANGE), dátum, költség. Ha egy jármű MAINTENANCE állapotban van, ne legyen foglalható. Hogyan kezeljem az automatikus státuszváltást a szerviz után?

AI Válasz:
- MaintenanceLog entitás létrehozása
- Admin UI: VehicleMaintenancePage forma a szervizadatok rögzítésére
- Logika: Vehicle.status = MAINTENANCE alatt a foglalások nem jöhetnek létre
- Szerviz befejezése után: admin manuálisan állítja vissza az AVAILABLE állapotot
- Megjegyzés: Javasolt cron job az inspectionValidUntil és nextServiceDate alapján automatikus MAINTENANCE státusztá konvertáláshoz

Állapot: ELFOGADVA MÓDOSÍTÁSSAL
Indoklás: Az alapfunkció implementálva lett, de az automatikus blokkolás (cron job) egy jövőbeni feature-t képez (v1.2+). Egyelőre az admin manuálisan módosíthatja a státuszt.


---

8. Notification/Alert rendszer - Szerviz emlékeztetők

Prompt:
Az adminisztrátorok automatikus értesítéseket kapjanak, ha egy jármű szervize hamarosan lejár (pl. 500 km-en belül vagy 7 nap múlva). Hogyan implementáljam ezt az adatbázis szintjén?

AI Válasz:
- Javaslat: Scheduled task (@Scheduled) a backend-ben, amely naponta/óránként futtat egy check-et
- Query logika: Vehicle-ket kigyűjteni, ahol currentMileage >= (nextServiceMileage - 500) VAGY LocalDate.now().plusDays(7) >= nextServiceDate
- Notifikáció store-olása: Notification entitás vagy email küldés
- Frontend: Toast/banner widget az admin dashboard-on
- Üzenetsor (message queue) is javasolt a skálázhatóság miatt (RabbitMQ, Kafka)

Állapot: TERVEZETT FEATURKÉNT
Indoklás: Az alapkoncepciónak megfelelő, de a jelenlegi sprintban nem prioritás. Terv: v1.3 (Q3 2026).


---

9. Adatvalidáció és error handling - API szintű hibakezelés

Prompt:
Hogyan implementáljam a validációt az API szintjén? Mi történjen, ha egy alkalmazott egy már lezárt foglalást próbál módosítani? Milyen HTTP status-t adjak vissza?

AI Válasz:
- Bean Validation annotations bevezetése: @NotNull, @Email, @Min, @Max
- Custom validators: @BookingDateValidator az overlapping check-hez
- GlobalExceptionHandler: @ControllerAdvice az unified error response-hoz
- HTTP status-ok:
  400 Bad Request - Validációs hiba
  403 Forbidden - Nem jogosult (pl. saját booking módosítása)
  404 Not Found - Entitás nem létezik
  409 Conflict - Üzleti logikai konfliktus (pl. státusz gépállapot sértés)
- Error response DTO: {status, message, timestamp, fieldErrors}

Állapot: ELFOGADVA
Indoklás: Teljes error handling implementálva lett, az OpenAPI dokumentáció is elkészült.


---

10. Testing stratégia - Backend unit- és integrációs tesztek

Prompt:
Írj unit teszt esetek a BookingService-hez, amely teszteli az ütközésdetekciót, státusz tranzíciót, és cost kalkulációt. Javasolt framework?

AI Válasz:
- JUnit 5 + Mockito framework javaslat
- Test esetek:
  1. testBookingCreation_ValidDates_Success
  2. testBookingCreation_ConflictingDates_ThrowException
  3. testBookingStatusTransition_PendingToApproved_Success
  4. testBookingStatusTransition_InvalidTransition_ThrowException
  5. testCostCalculation_DailyPriceTimesNumberOfDays
- Integrációs teszt: @SpringBootTest + TestContainers a valódi PostgreSQL-hez
- Coverage cél: >80% a BookingService-hez

Állapot: ELFOGADVA
Indoklás: Alapvető tesztek írásban, coverage jelenleg ~60%, cél 80% az alpha release-ig.

============================================

ELFOGADÁS/MÓDOSÍTÁS/ELUTASÍTÁS DOKUMENTÁLÁSA

Döntés 1: Foglalás törlésének engedélyezése ACTIVE állapotból

Prompt:
Lehessen-e egy ACTIVE (aktív) foglalást törlésre az alkalmazottnak vészhelyzet miatt?

AI Javaslat:
- ACTIVE foglalás nem törölhető, csak az admin tudja CANCELLED-re tenni (büntetéssel)

Hallgató döntése: MÓDOSÍTVA
Indoklás: A terület szabályozása szerint, ha az alkalmazott vészhelyzet miatt nem tudja használni a járművet, lehetőségét kell adni a törlésre. Azonban: csak admin-nak jelent be, majd az admin dönt (nincs automatikus törlés). Ez a felhasználói élmény javulásához szükséges.


---

Döntés 2: JWT token lejárati ideje

Prompt:
Milyen hosszú legyen a JWT token lejárati ideje az FMS-ben? 1 óra, 24 óra, vagy 7 nap?

AI Javaslat:
- Javasolt: 1 óra (security), refresh token 7 nap (UX)

Hallgató döntése: ELFOGADVA MÓDOSÍTÁSSAL
Indoklás: Az 1 órás token jó a biztonsági szempontból, de az admin napi munkafolyamatához túl rövid. Módosított döntés: 2 óra (jó kompromisszum). Refresh token 30 nap marad a "Remember me" funkcióhoz.


---

Döntés 3: Frontend offline funcionálása

Prompt:
Implementáljunk offline mode-ot az alkalmazáshoz Service Worker + IndexedDB segítségével?

AI Javaslat:
- Igen, javasolt a Service Worker registration és cached API response-ok

Hallgató döntése: ELUTASÍTVA
Indoklás: Az FMS kritikus üzleti logikája (foglalás ütközésdetekció) valós idejű szinkronizációt igényel. Offline mode megtévesztő lehet (pl. offline foglalások, amelyek majd konfliktussal szembesülnek szinkronizálásnál). Egyenlőre nem prioritás, lehet jövőbeni feature.


---

Döntés 4: Role-based permission system - Granular kontrol

Prompt:
Adjonk-e al-típusú szerepeket az adminisztrátoroknak? Pl. 'Fleet Manager' (járműkezelés), 'Booking Approver' (foglalás jóváhagyás), 'Finance' (költségkezelés)?

AI Javaslat:
- Igen, javasolt az RBAC (Role-Based Access Control) kiterjesztése

Hallgató döntése: MÓDOSÍTVA
Indoklás: Az MVP-hez túl összetett. Jelenlegi scope: ADMIN (full access) és EMPLOYEE (limited access). A granular permission system (PERMISSION entitás) a v2.0-ban kerül implementálásra. Egyelőre az ADMIN role-ban marad az összes jogosultság.


---

Döntés 5: Picture upload funkció prioritása

Prompt:
Prioritáson kívül vagy belül van-e a járműfotók feltöltésének funkciója? Cloud storage (S3, Azure Blob) vs lokális?

AI Javaslat:
- Javasolt: AWS S3 használat (scalable, secure)

Hallgató döntése: MÓDOSÍTVA + KITOLT
Indoklás: Az MVP-hez nem szükséges a képek. Az érdeklődés van, de később kerül implementálásra. Ha hozzáadódik: jelenlőleg lokális file storage a szerverben (simpler setup), majd később S3-ra migrálás. Cloud költségek a jelenlegi budget-ben nem férnek meg.

============================================

KRITIKUS GONDOLKODÁS ÉS AI KORLÁTOK

Eset 1: Conflicting Requirements - Booking duplikáció logika

Helyzet:
Az AI javasolt JPQL query az ütközésdetekciót, de az implementáció során hamar kiderült: a query nem kezeli helyesen az PENDING státuszú foglalásokat.

Prompt volt:
A query ezeket az állapotokat vizsgálja: (PENDING, APPROVED, ACTIVE). Logikus?

AI Válasz (HIBÁS):
- "Igen, a PENDING foglalásokat is figyelembe kell venni az ütközésdetekciót a kettős foglalás megelőzésére."

Valódi probléma:
A PENDING foglalást a dolgozó lemondhatja azonnal, ezért az ütközésdetekció ne vegye figyelembe a PENDING-et. Ellenkező esetben:
1. Alkalmazott A: PENDING foglalás (május 5-8)
2. Alkalmazott B: Nem tudja ugyanerre az időpontra PENDING-et rögzíteni (conflict error)
3. Alkalmazott A lemondja (CANCELLED), de B már nem tudja foglalni

Hallgatónak szükséges volt az AI kiegészítése:
- Javasolt logika módosítása: csak (APPROVED, ACTIVE) státuszok száraznak az ütközésdetekciót
- PENDING foglalás nem blokkolja az új foglalást, csak az admin jóváhagyása után

Tanulság:
Az AI jól gondolkodott az adatbázis szintű logikán, de üzleti szabályok finomságai hiányoztak. A hallgatónak kell az adott domain üzleti ismerete és a tényleges felhasználói szituációk szimulálása.


---

Eset 2: Tech Stack választás - Frontend framework

Helyzet:
Az AI az inicializálásban Angular-t javasolt, de később felvetődött: Vue.js vagy React könnyebbek lennének?

Prompt volt:
Angular vs React vs Vue.js: melyik a legjobb egy flotta-kezelő SPA-hoz?

AI Válasz (FÉLREVEZETETT):
- "Angular a legjobb nagyvállalati alkalmazásokhoz: built-in DI, RxJS, TypeScript natív"
- "React: nagyobb ökoszisztéma, de több 3rd-party library szükséges"
- "Vue: könnyebb tanulási görbe, de kevesebb enterprise tooling"

Valódi probléma:
Az AI általánosított választ adott, de a konkrét projektgörbét nem vette figyelembe:
1. A team egyetlen ember a frontend-ben (hallgató maga) – tanulási görbe **nagyon lényeges**
2. Egyszerre tanulja az **Angular + RxJS + TypeScript** kombót – overhead
3. React + hooks vagy Vue sokkal **forgalmas tanulás lenne 2-3 hét helyett 1 hétben**

Hallgatónak szükséges volt az AI kiegészítése:
- A döntés már megtörtént (Angular), de jó lett volna egy "van-e Angularban jártas tanú?" kérdés
- Az AI nem érdeklődött a team körülményeiről: méret, tapasztalat, deadline
- Jó lett volna egy "tanulási görbe vs funkcionalitás" trade-off analízis

Tanulság:
Az AI nem tudott adequately a szubjektív szervezeti/humán faktorokat kezelni. A döntésnek szüksége lett volna az üzleti kontextus jobb megértésére (ki fejleszt, milyen tapasztalattal, stb.).

============================================

A PROJEKT FEJLESZTÉSI ÍVE

Fázis 1: Projekt megtervezése és inicializálása 
Promptok: Sok kérdező/beszélgető/tudakozó promt és 3-5 olyan, amitől megír/létrehoz fájlokat

Fázis 2: Backend Mag Fejlesztés
Promptok: 5-10 (state machine)

Fázis 3: Frontend UI Fejlesztése (itt nagyon szembevágott a function creep)
Promptok: ~20 (UI komponensek)

Fázis 4: Backend és frontend összekapcsolása (rengeteg extra dologra itt jötem rá, hogy még kell mindkét oldalon)
Promptok: ~20 

Fázis 5: Tesztelés és javítgatás 
Promptok: 15-20 




