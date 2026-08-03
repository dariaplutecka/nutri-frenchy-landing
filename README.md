# Nutri Frenchy — Landing

Statyczny lander aplikacji **Nutri Frenchy** (PL/EN): hero, funkcje, artykuły, polityka prywatności.

## Lokalny podgląd

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080
```

Przy samym serwerze statycznym ustaw API w `config.js` (patrz niżej), bo formularz i link App Store wołają backend.

## Konfiguracja API (`config.js`)

```js
window.LANDING_CONFIG = {
  // Puste = to samo origin (gdy lander i API są na tej samej domenie / reverse proxy)
  apiBaseUrl: "",
};
```

Osobny hosting landera (np. Vercel/Netlify) + backend na Railway:

```js
window.LANDING_CONFIG = {
  apiBaseUrl: "https://twoj-serwis.up.railway.app",
};
```

Endpointy:
- `GET {apiBaseUrl}/api/landing/config`
- `POST {apiBaseUrl}/api/beta/signup`

W backendzie dodaj origin landera do `CORS_ORIGINS`.

## Struktura

```
config.js             # apiBaseUrl i inne ustawienia
index.html            # strona główna
articles/             # lista i artykuły SEO
privacy/              # polityka prywatności
assets/               # logo, maskotka, favicon
app.js / i18n.js      # logika + tłumaczenia
styles.css
robots.txt / sitemap.xml
```

## Repo

Wydzielone z monorepo [nutri-frenchy](https://github.com/dariaplutecka/nutri-frenchy) (`web/`).
