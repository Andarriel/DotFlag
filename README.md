DotFlag

DotFlag este o platformă de tip Capture The Flag (CTF) robustă și performantă, dezvoltată în .NET și structurată pe principiile Clean Architecture. Aceasta oferă un mediu complet pentru găzduirea competițiilor de securitate cibernetică, incluzând medii virtualizate pentru analiza problemelor și monitorizare în timp real.

🚀 Funcționalități

    Pagina de Quest-uri: Un hub centralizat unde utilizatorii pot naviga, filtra și accesa provocările din diverse categorii.

    Pagina de Administrare: Control total asupra creării de provocări, gestionării utilizatorilor și configurării platformei.

    Leaderboard: Clasament în timp real bazat pe punctajele obținute și timpul de rezolvare.

    Containere Virtuale: Suport integrat pentru analiza problemelor folosind medii izolate.

    Profil Utilizator: Istoric detaliat al problemelor rezolvate, realizări și statistici de performanță.

    Chat de Echipă (în lucru): Instrumente de colaborare pentru strategii în cadrul echipei.

    Backend API: Un API extensibil cu minimum 12 endpoint-uri (incluzând 4 seturi complete de operațiuni CRUD).

🏗️ Arhitectură Tehnică

Proiectul respectă normele Clean Architecture pentru a asigura un cod decuplat, testabil și ușor de întreținut.
Tehnologii Utilizate

    Framework: .NET 8 / Core

    Bază de date: Suport pentru PostgreSQL sau MySQL

    Autentificare: Session-based authentication (Sesiuni securizate, fără token-uri JWT)

    Acces Date: Entity Framework Core

Modelul de Date

Sistemul este construit în jurul a 6 entități principale:

    User: Gestionarea identității și a profilului.

    Challenge (Quest): Task-ul principal, conținând flag-ul și punctajul.

    Submission: Înregistrarea tentativelor și a succeselor utilizatorilor.

    Category: Gruparea provocărilor (ex: Pwn, Web, Crypto, Reverse Engineering).

    Team: Gruparea utilizatorilor pentru competiția pe echipe.

    ContainerConfig: Metadate pentru lansarea mediilor de analiză virtualizate.

🛠️ Instalare și Configurare

    Clonarea depozitului
    Bash

    git clone https://github.com/username-ul-tau/DotFlag.git
    cd DotFlag

    Configurarea Bazei de Date Actualizează connection string-ul în appsettings.json pentru a pointa către instanța ta de PostgreSQL sau MySQL.

    Rularea Migrărilor
    Bash

    dotnet ef database update

    Lansarea Aplicației
    Bash

    dotnet run

🔒 Securitate și Autentificare

Spre deosebire de multe aplicații web moderne, DotFlag utilizează autentificarea bazată pe sesiune. Această abordare a fost aleasă pentru:

    Simplificarea procesului de logout și invalidare a sesiunilor.

    Atenuarea riscurilor asociate cu stocarea token-urilor pe partea de client (XSS).

    Menținerea unei conexiuni sigure și stateful între competitor și platformă.

🛣️ Roadmap

    [ ] Operațiuni CRUD de bază pentru Challenge-uri și Utilizatori

    [ ] Implementarea autentificării pe bază de sesiune

    [ ] Integrare PostgreSQL

    [ ] Finalizarea funcționalității de Chat pentru echipe

    [ ] Optimizarea orchestrării containerelor (Docker/K8s)