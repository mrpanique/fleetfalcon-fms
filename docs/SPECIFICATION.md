\# Rendszerspecifikáció: FleetFalcon (FMS)



\## Projekt leírás

A \*\*FleetFalcon\*\* egy modern, webes alapú gépjárműflotta-kezelő alkalmazás (Fleet Management System). Kifejezetten olyan vállalkozások számára készül, akik átlátható, könnyen kezelhető felületen szeretnék adminisztrálni a céges gépjárműparkot és a járműfoglalásokat. 



\## Funkcionális követelmények

Az alkalmazás az alábbi modulokra és mélyebb üzleti logikákra tagolódik:



\### 1. Járműpark Kezelés (Vehicle Inventory Management)

\* \*\*CRUD műveletek:\*\* Gépjárművek teljes körű adminisztrációja.

\* \*\*Metaadatok követése:\*\* Márka, Modell, Rendszám, Típus és Napi bérleti díj (Daily Price) rögzítése.

\* \*\*Valós idejű elérhetőség:\*\* A járművek foglalhatósági állapota automatikusan szinkronizálódik az aktív foglalások adatai alapján.



\### 2. Foglalási Életciklus (Booking Lifecycle)

\* \*\*Ütközésfigyelés (Conflict Detection):\*\* Megakadályozza az átfedésben lévő foglalásokat ugyanarra a járműre.

\* \*\*Állapotgép (State Machine):\*\* A foglalások egy logikailag zárt folyamaton mennek keresztül: 

&#x20; `PENDING (Függő)` ➡️ `APPROVED (Jóváhagyott)` ➡️ `ACTIVE (Aktív)` ➡️ `COMPLETED (Lezárt)`.

&#x20; \* Kezeli továbbá a `REJECTED (Elutasított)` és `CANCELLED (Visszavont)` állapotokat is.

\* \*\*Check-out / Check-in Rendszer:\*\* \* Induló és érkezési kilométeróra állás rögzítése.

&#x20;   \* A megtett távolság dinamikus kiszámítása.

&#x20;   \* Logikai validációk (pl. a záró kilométer nem lehet kevesebb a kezdőnél; aktív út nem mondható le).



\## Nem-funkcionális követelmények

\* \*\*Architektúra:\*\* Controller-Service-Repository

\* \*\*Backend (Szerveroldal):\*\* Java (Spring Boot), Spring Data JPA, Hibernate ORM, REST API (JSON).

\* \*\*Adatbázis:\*\* PostgreSQL

\* \*\*Frontend (Kliensoldal):\*\* Angular (TypeScript), aszinkron hálózati kommunikációval (RxJS Observables). A stílusozáshoz SCSS.

\* \*\*Teljesítmény és UX-elvárások:\*\*

&#x20;   \* Aszinkron adatbetöltés (SPA).

&#x20;   \* Reszponzív, letisztult felhasználói felület.

&#x20;   \* Azonnali vizuális visszajelzések a felhasználói interakciókról.



\## Felhasználói szerepkörök

A rendszerben legalább két, eltérő jogosultságokkal rendelkező szerepkör található:



1\.  \*\*Adminisztrátor:\*\*

&#x20;   \* Teljes körű (CRUD) hozzáféréssel rendelkezik a járművekhez és a felhasználókhoz.

&#x20;   \* Látja az összes dolgozó foglalását.

&#x20;   \* Szerkesztheti vagy törölheti a gépjárműpark elemeit, felülbírálhatja a foglalásokat.

2\.  \*\*Alkalmazott:\*\*

&#x20;   \* Olvasási (Read) joggal rendelkezik a járművek listájához.

&#x20;   \* Csak a saját foglalásait hozhatja létre, tekintheti meg és vonhatja vissza.

