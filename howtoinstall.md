# How to install / Kako instalirati

[Bosanski](#bosanski) | [English](#english)

---

## Bosanski

Instalacijske datoteke preuzimajte samo iz dijela **Releases** ovog repozitorija na GitHubu. Ne instalirajte datoteke koje ste dobili iz drugih izvora.

### Zašto se prikazuje upozorenje da aplikacija nije sigurna?

Program se ne nalazi na Google Playu, pa ga Google nije pregledao. Zbog toga Android i Windows prikazuju upozorenje za svaku aplikaciju koja nije iz službene prodavnice ili nema plaćeni digitalni potpis. Upozorenje ne znači da je program štetan. Ovaj program:

- ne traži nikakve dozvole,
- ne koristi internet,
- ne prikuplja podatke,
- ima potpuno otvoren izvorni kod, koji svako može pregledati u ovom repozitoriju.

### Android (.apk)

Nazivi menija se razlikuju zavisno od verzije Androida i proizvođača telefona ili tableta, ali koraci su uvijek slični.

1. Otvorite stranicu **Releases** i preuzmite `.apk` datoteku.
2. Preglednik može prikazati upozorenje da ta vrsta datoteke može naškoditi uređaju. Odaberite **Preuzmi svejedno** (Download anyway).
3. Otvorite preuzetu datoteku (iz obavještenja o preuzimanju ili iz aplikacije Datoteke).
4. Android će reći da instalacija nepoznatih aplikacija nije dozvoljena. Odaberite **Podešavanja** i uključite **Dozvoli iz ovog izvora** za aplikaciju iz koje ste otvorili datoteku (preglednik ili Datoteke). Vratite se nazad.
5. Google Play Protect može prikazati upozorenje poput "Aplikacija nije sigurna", "Nepoznati programer" ili "Aplikacija blokirana". Odaberite **Više detalja** (More details), a zatim **Ipak instaliraj** (Install anyway).
6. Kada se instalacija završi, odaberite **Otvori**.
7. Preporuka: nakon instalacije isključite dozvolu iz koraka 4 da se ubuduće ne mogu slučajno instalirati druge nepoznate aplikacije.

#### Novija pravila Googlea (verifikacija programera)

Google uvodi provjeru identiteta programera za aplikacije na certificiranim Android uređajima. Provjera je počela 30. septembra 2026. u Brazilu, Indoneziji, Singapuru i Tajlandu, a širenje na ostatak svijeta planirano je za 2027. godinu. Kada ta pravila stignu i do vas, aplikacije programera koji nisu prošli provjeru moći će se instalirati samo kroz poseban "napredni postupak" (advanced flow). Prema Googleovom opisu on uključuje:

1. Uključivanje opcija za programere (Developer options): u Podešavanjima otvorite **O telefonu** i sedam puta dodirnite **Broj verzije** (Build number).
2. U opcijama za programere uključite dozvolu za aplikacije od neprovjerenih programera i potvrdite zaključavanjem ekrana (PIN, šablon ili otisak).
3. Moguće je da će biti potrebno ponovno pokretanje uređaja i čekanje do 24 sata prije prve instalacije.
4. Potvrdite da razumijete rizik, odaberite koliko dugo dozvola vrijedi, pa instalirajte i odaberite **Ipak instaliraj**.

Alternativa za računar je instalacija preko ADB-a (naredba `adb install datoteka.apk`, uz uključeno USB otklanjanje grešaka).

Ovi koraci mogu se promijeniti. Najnovije informacije su na Googleovom blogu za programere: https://android-developers.googleblog.com/2026/03/android-developer-verification.html

#### Najčešći problemi

- **Aplikacija nije instalirana (App not installed):** ako ste ranije instalirali verziju potpisanu drugim ključem, prvo deinstalirajte staru verziju pa instalirajte novu.
- **Greška pri analizi paketa (Parse error):** preuzimanje je vjerovatno nepotpuno ili oštećeno. Preuzmite datoteku ponovo.
- **Dugme "Instaliraj" ne reaguje:** provjerite da je dozvola iz koraka 4 uključena za aplikaciju iz koje ste otvorili datoteku.

### Windows (.exe)

1. Otvorite stranicu **Releases** i preuzmite `.exe` datoteku.
2. Preglednik može upozoriti da se datoteka rijetko preuzima. Odaberite da je zadržite (Keep).
3. Pokrenite preuzetu datoteku dvostrukim klikom.
4. Windows SmartScreen može prikazati plavi prozor **"Windows je zaštitio vaš računar"** (Windows protected your PC). Kliknite **Više informacija** (More info), a zatim **Ipak pokreni** (Run anyway).
5. Antivirusni programi ponekad upozore na programe koji nemaju plaćeni digitalni potpis. Ako se to desi, program možete dozvoliti u antivirusu.

Windows prikazuje to upozorenje jer program nema plaćeni digitalni potpis (code signing certifikat) i još nema dovoljno preuzimanja da stekne ugled kod SmartScreena.

### Provjera ispravnosti preuzete datoteke (nije obavezno)

Ako je uz izdanje objavljen SHA-256 hash, možete provjeriti da je datoteka tačna i neizmijenjena:

- Windows (PowerShell ili Command Prompt): `certutil -hashfile NazivDatoteke SHA256`
- macOS i Linux: `shasum -a 256 NazivDatoteke`

Dobijeni niz znakova mora biti isti kao onaj objavljen uz izdanje.

### Instalacija na više uređaja u školi

Datoteku je dovoljno preuzeti jednom pa je kopirati na ostale uređaje (USB kabl, USB stick ili zajednički folder) i instalirati po koracima iznad.

---

## English

Download the installation files only from the **Releases** section of this GitHub repository. Do not install files you received from other sources.

### Why is there a warning that the app is not safe?

The program is not on Google Play, so Google has not reviewed it. Because of that, Android and Windows show a warning for every app that does not come from the official store or does not have a paid digital signature. The warning does not mean the program is harmful. This program:

- does not request any permissions,
- does not use the internet,
- does not collect any data,
- has fully open source code that anyone can review in this repository.

### Android (.apk)

Menu names differ depending on the Android version and the phone or tablet manufacturer, but the steps are always similar.

1. Open the **Releases** page and download the `.apk` file.
2. Your browser may warn that this type of file can harm your device. Choose **Download anyway**.
3. Open the downloaded file (from the download notification or from the Files app).
4. Android will say that installing unknown apps is not allowed. Choose **Settings** and turn on **Allow from this source** for the app you opened the file from (the browser or Files). Go back.
5. Google Play Protect may show a warning such as "App not safe", "Unknown developer" or "App blocked". Choose **More details**, then **Install anyway**.
6. When the installation finishes, choose **Open**.
7. Recommendation: after installing, turn off the permission from step 4 so that other unknown apps cannot be installed by accident later.

#### Newer Google rules (developer verification)

Google is introducing identity verification for developers on certified Android devices. Enforcement began on 30 September 2026 in Brazil, Indonesia, Singapore and Thailand, and a global expansion is planned for 2027. Once these rules reach your country, apps from developers who have not been verified will only be installable through a special "advanced flow". According to Google's description, it includes:

1. Turning on Developer options: in Settings open **About phone** and tap **Build number** seven times.
2. In Developer options, turn on the permission for apps from unverified developers and confirm with your screen lock (PIN, pattern or fingerprint).
3. A device restart and a waiting period of up to 24 hours may be required before the first installation.
4. Confirm that you understand the risk, choose how long the permission lasts, then install and choose **Install anyway**.

An alternative from a computer is installing through ADB (the command `adb install file.apk`, with USB debugging turned on).

These steps may change. The latest information is on Google's Android Developers Blog: https://android-developers.googleblog.com/2026/03/android-developer-verification.html

#### Common problems

- **App not installed:** if you previously installed a version signed with a different key, uninstall the old version first, then install the new one.
- **Parse error:** the download is probably incomplete or corrupted. Download the file again.
- **The "Install" button does nothing:** check that the permission from step 4 is turned on for the app you opened the file from.

### Windows (.exe)

1. Open the **Releases** page and download the `.exe` file.
2. Your browser may warn that the file is not commonly downloaded. Choose to keep it.
3. Run the downloaded file by double-clicking it.
4. Windows SmartScreen may show a blue window saying **"Windows protected your PC"**. Click **More info**, then **Run anyway**.
5. Antivirus programs sometimes warn about programs that do not have a paid digital signature. If that happens, you can allow the program in your antivirus.

Windows shows this warning because the program does not have a paid code signing certificate and does not yet have enough downloads to build reputation with SmartScreen.

### Verifying the downloaded file (optional)

If a SHA-256 hash is published with the release, you can check that the file is correct and unmodified:

- Windows (PowerShell or Command Prompt): `certutil -hashfile FileName SHA256`
- macOS and Linux: `shasum -a 256 FileName`

The resulting string must match the one published with the release.

### Installing on multiple school devices

It is enough to download the file once and then copy it to the other devices (USB cable, USB stick or a shared folder) and install it using the steps above.