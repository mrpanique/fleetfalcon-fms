# Rendszerspecifikáció: FleetFalcon (FMS)

## Projekt leírás

A **FleetFalcon** egy modern, webes alapú gépjárműflotta-kezelő alkalmazás (Fleet Management System). Kifejezetten olyan vállalkozások számára készül, akik átlátható, könnyen kezelhető felületen szeretnék adminisztrálni a céges gépjárműparkot és a járműfoglalásokat. 

## Funkcionális követelmények

Az alkalmazás az alábbi modulokra és mélyebb üzleti logikákra tagolódik:

### 1. Járműpark Kezelés (Vehicle Inventory Management)

* **CRUD műveletek:** Gépjárművek teljes körű adminisztrációja.
* **Metaadatok követése:** Márka, Modell, Rendszám, Típus és Napi bérleti díj (Daily Price) rögzítése.
* **Valós idejű elérhetőség:** A járművek foglalhatósági állapota automatikusan szinkronizálódik az aktív foglalások adatai alapján.

### 2. Foglalási Életciklus (Booking Lifecycle)

* **Ütközésfigyelés (Conflict Detection):** Megakadályozza az átfedésben lévő foglalásokat ugyanarra a járműre.
* **Állapotgép (State Machine):** A foglalások egy logikailag zárt folyamaton mennek keresztül: 
  `PENDING (Függő)` ➡️ `APPROVED (Jóváhagyott)` ➡️ `ACTIVE (Aktív)` ➡️ `COMPLETED (Lezárt)`.
  * Kezeli továbbá a `REJECTED (Elutasított)` és `CANCELLED (Visszavont)` állapotokat is.
* **Check-out / Check-in Rendszer:** * Induló és érkezési kilométeróra állás rögzítése.
  * A megtett távolság dinamikus kiszámítása.
  * Logikai validációk (pl. a záró kilométer nem lehet kevesebb a kezdőnél; aktív út nem mondható le).

### 3. Karbantartás és Szerviznapló (Maintenance & Service Tracking)
* **Szerviztörténet vezetése:** A gépjárművekhez tartozó javítások, kötelező szervizek, gumicserék és eseti karbantartások teljes körű adminisztrációja (Maintenance Log).
* **Proaktív riasztások (Alerting):** A rendszer a dinamikusan frissülő kilométeróra-állás és a lejárati dátumok (pl. műszaki vizsga) alapján automatikus értesítést generál az adminisztrátorok számára a szükséges szervizelés előtt.
* **Biztonsági blokkolás:** A szerviz alatt álló (`MAINTENANCE`), vagy lejárt okmányokkal rendelkező járművek foglalhatósága automatikusan felfüggesztésre kerül a rendszerben.

## Nem-funkcionális követelmények

* **Architektúra:** Controller-Service-Repository
* **Backend (Szerveroldal):** Java (Spring Boot), Spring Data JPA, Hibernate ORM, REST API (JSON).
* **Adatbázis:** PostgreSQL
* **Frontend (Kliensoldal):** Angular (TypeScript), aszinkron hálózati kommunikációval (RxJS Observables). A stílusozáshoz SCSS.
* **Teljesítmény és UX-elvárások:**
  * Aszinkron adatbetöltés (SPA).
  * Reszponzív, letisztult felhasználói felület.
  * Azonnali vizuális visszajelzések a felhasználói interakciókról.

## Felhasználói szerepkörök

A rendszerben legalább két, eltérő jogosultságokkal rendelkező szerepkör található:

1. **Adminisztrátor:**
  * Teljes körű (CRUD) hozzáféréssel rendelkezik a járművekhez és a felhasználókhoz.
  * Látja az összes dolgozó foglalását.
  * Szerkesztheti vagy törölheti a gépjárműpark elemeit, felülbírálhatja a foglalásokat.

2. **Alkalmazott:**
  * Olvasási (Read) joggal rendelkezik a járművek listájához.
  * Csak a saját foglalásait hozhatja létre, tekintheti meg és vonhatja vissza.