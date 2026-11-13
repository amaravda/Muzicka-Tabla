# Muzička Tabla / Music Board

[Bosanski](#bosanski) | [English](#english)

---

## Bosanski

### O programu

Muzička Tabla je besplatna digitalna tabla za nastavu muzičke kulture. Linijski sistemi su već nacrtani na ekranu, pa nastavnik ili učenik može odmah pisati note, crtati i objašnjavati direktno na tabli.

Program je napravljen da pomogne školama: besplatan je, radi bez interneta i ne traži nikakve dozvole.

### Mogućnosti

- Linijski sistemi se sami prilagode veličini ekrana. Svaki sistem ima tačno 5 linija, a linije su oštre na svim ekranima.
- Violinski ključ se uključuje i isključuje jednim dugmetom (po zadanom je isključen).
- Tri boje olovke: crna, crvena i žuta.
- Gumica ima sivi obris koji pokazuje njenu veličinu. Što se brže pomjera, to je veća.
- Debljina olovke i gumice podešava se dugim pritiskom na boju ili gumicu. Program pamti posljednje podešene vrijednosti.
- Dugme "Obriši sve" traži potvrdu prije brisanja.
- Bez zumiranja, bez skrolanja i bez označavanja teksta.
- Na Androidu radi preko cijelog ekrana u vodoravnom položaju.
- Ne koristi internet, ne traži nikakve dozvole i ne prikuplja nikakve podatke.

### Preuzimanje i instalacija

Instalacijske datoteke (.apk za Android i .exe za Windows) nalaze se u dijelu **Releases** ovog repozitorija.

Detaljne upute, uključujući šta uraditi kada Android ili Windows prikažu upozorenje da aplikacija nije sigurna, nalaze se u datoteci [HOWTOINSTALL.md](HOWTOINSTALL.md).

### Podešavanje

Sve postavke nalaze se na vrhu datoteke `script.js`, u objektu `CONFIG`. Tu se mogu promijeniti veličina violinskog ključa, željena veličina razmaka između linija (od koje zavisi broj linijskih sistema), boje linija i ponašanje gumice.

### Struktura projekta

| Datoteka | Opis |
| --- | --- |
| `index.html` | Struktura stranice |
| `style.css` | Izgled |
| `script.js` | Cijela logika programa |

### Licenca

Projekat je objavljen pod **MIT licencom**. To znači da program možete besplatno koristiti, kopirati, mijenjati i dijeliti dalje, u školi ili bilo gdje drugo, čak i u komercijalne svrhe. Jedini uslov je da uz kopiju programa ostane navedeno ime autora i tekst licence (datoteka [LICENSE](LICENSE)). Program se daje "takav kakav jeste", bez ikakve garancije.

### Autor

Napravio: Amar Avda™

---

## English

### About

Music Board (Muzička Tabla) is a free digital whiteboard for music lessons. The staves are already drawn on the screen, so a teacher or a student can start writing notes, drawing and explaining directly on the board.

It was made to help schools: it is free, it works offline and it does not ask for any permissions.

### Features

- The staves automatically adjust to the screen size. Every staff has exactly 5 lines, and the lines are sharp on every screen.
- The treble clef is switched on and off with a single button (off by default).
- Three pen colors: black, red and yellow.
- The eraser has a gray outline that shows its size. The faster it moves, the bigger it gets.
- Pen and eraser thickness is set by long-pressing a color or the eraser. The program remembers the last values you chose.
- The "Obriši sve" (Clear all) button asks for confirmation before deleting.
- No zooming, no scrolling and no text selection.
- On Android it runs fullscreen in landscape orientation.
- It does not use the internet, does not request any permissions and does not collect any data.

### Download and installation

The installation files (.apk for Android and .exe for Windows) are available in the **Releases** section of this repository.

Detailed instructions, including what to do when Android or Windows shows a warning that the app is not safe, are in [HOWTOINSTALL.md](HOWTOINSTALL.md).

### Configuration

All settings are at the top of `script.js`, in the `CONFIG` object. There you can change the treble clef size, the preferred spacing between staff lines (which determines how many staves fit on the screen), the line colors and the eraser behavior.

### Project structure

| File | Description |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Appearance |
| `script.js` | All program logic |

### License

This project is released under the **MIT License**. In short: you may use, copy, modify and share the program for free, in a school or anywhere else, including for commercial purposes. The only condition is that the author's name and the license text (the [LICENSE](LICENSE) file) stay with every copy. The program is provided "as is", without any warranty.

### Author

Made by: Amar Avda™
