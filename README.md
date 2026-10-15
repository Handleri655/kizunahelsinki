# Ravintola KIZUNA

Uudet sivut ravintolalle [kizunahelsinki.com](https://www.kizunahelsinki.com/). Staattinen Astro-sivusto, kielet suomi (oletus), englanti ja japani.

## Käynnistys

Astro 7 vaatii Node.js-version 22.22 tai uudemman. Tätä konetta käytettäessä `npm run dev` ei käynnisty Node 22.17:llä. Päivitä Node ennen käynnistystä.

```bash
npm install
npm run dev
```

Sivu aukeaa osoitteeseen `http://localhost:4321`.

Tuotantoversio:

```bash
npm run build
npm run preview
```

Muut komennot: `npm run lint` ja `npm run format`.

## Miten menu päivitetään

Hinnat ja annokset ovat tiedostoissa `src/content/menu/`:

- `lunch.json` — lounas, ma–pe 11–15
- `dinner.json` — illallisen syyslista
- `brunch.json` — lauantain brunssi, 25 €
- `drinks.json` — juomat

Jokaisella annoksella on nimi, kuvaus ja tarvittaessa hinta kolmella kielellä (`fi`, `en`, `ja`). Hinta kirjoitetaan merkkijonona ilman euro-merkkiä, esimerkiksi `"16,5"`. Kaksi hintaa (lasi ja pullo) kirjoitetaan samaan kenttään: `"10 / 80"`.

Allergeenimerkit ovat samat kuin ravintolan listassa:

- `G` gluteeniton
- `V` kasvis
- `VE` vegaani
- `L` listassa käytetty, selittämätön merkki jälkiruoissa

Jos annoksesta on vegaaninen vaihtoehto, mutta koko annos ei ole vegaaninen, lisää `"veganOption": true`.

Tallenna tiedosto ja käynnistä sivu uudelleen. Uusi build julkaisee muutoksen.

Jos lisäät japanilaisen merkin, jota sivulla ei ole ennen käytetty, se voi näkyä laatikkona. Fontit on rajattu sivulla käytettyihin merkkeihin, jotta sivu pysyy kevyenä. Merkki pitää silloin lisätä fonttitiedostoihin `src/assets/fonts/shippori-mincho-jp-500.woff2` ja `noto-sans-jp-400.woff2`.

## Julkaisu

`npm run build` tekee kansion `dist/`. Sen voi laittaa Cloudflare Pagesiin, Netlifyyn tai Verceliin staattisena sivustona. Julkaisukomento on `npm run build`, julkaisukansio `dist`.

## Domain

Nykyinen sivu on Squarespacessa. Kun uusi sivu on valmis:

1. Julkaise build esikatseluosoitteeseen ja käy se läpi ravintolan kanssa.
2. Squarespacen verkkotunnusasetuksista irrota `kizunahelsinki.com`, tai vaihda nimipalvelimet hosting-palvelun ohjeen mukaan.
3. Lisää domain hostingiin ja odota, että HTTPS-varmenne valmistuu.
4. Vanhaa Squarespace-sivua ei kannata poistaa ennen kuin uusi osoite vastaa.

Sivuston `site`-osoite on `astro.config.mjs`-tiedostossa. Sitä käytetään canonical-osoitteissa ja sivukartassa.

## Kuvat, jotka ravintolan pitää toimittaa

Kansiossa `src/assets/placeholder/` on paikkakuvia, ei ravintolan omia kuvia. Ne korvataan näillä:

- julkisivu, Pursimiehenkatu 12
- sali
- annoksia: sushi, ramen, yakitori, unadon, tofu
- keittiö, jos ravintola haluaa sen näkyvän

Ruokala Lokki -elokuvan stillkuvia ei käytetä. Elokuva mainitaan tekstinä.

Etusivun kuva otetaan käyttöön Astro-komponentilla `Image`, joten uusi kuva kannattaa tuoda samaan tapaan tiedostoon `src/assets/placeholder/atmosphere.png` tai sen tilalle.

## Avoimet kohdat

- Kartan koordinaatit on otettu osoitteen julkaistusta sijainnista (60°9′34″N, 24°56′19″E). Ne pitää vahvistaa ennen julkaisua.
- Reittiohjeessa mainitaan pysäkit Perämiehenkatu ja Telakkakatu. Raitiovaunulinjoja ei ole nimetty, koska niitä ei ole tarkistettu aikataulusta.
- Varaus avautuu linkkinä osoitteeseen Sciometa. Upotusta ei tehty, koska palvelun kehysoikeuksia ei ole varmistettu.
- Isompien seurueiden ja yksityistilaisuuksien ehdot puuttuvat. Sivulla pyydetään soittamaan tai laittamaan sähköpostia.
- Ruokalistan PDF `Food-MENU-26122025web.pdf` ei enää auennut. Illallislista on syksyn PDF:stä.
- `L`-merkkiä ei ole selitetty alkuperäisessä listassa. Sivu sanoo sen ääneen.
- Hinnat on poimittu näistä listoista: lounas ja brunssi (tiedostonimet viittaavat 28.8.2026), illallinen (9.9.2026) ja juomat (10.12.2025). Ravintolan kannattaa lukea ne kertaalleen ennen julkaisua.
