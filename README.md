# Nutri Frenchy — Landing

Statyczny lander aplikacji **Nutri Frenchy** (PL/EN): hero, funkcje, artykuły, polityka prywatności.

## Lokalny podgląd

```bash
# prosty serwer statyczny
python3 -m http.server 8080
# potem: http://127.0.0.1:8080
```

W monorepo `nutri-frenchy` lander jest też serwowany przez backend FastAPI pod `/` (port 8000).

## API używane przez lander

Formularz bety i link App Store wołają relative endpointy:

- `GET /api/landing/config`
- `POST /api/beta/signup`

Te endpointy są w głównym backendzie (`nutri-frenchy`). Przy osobnym hostingu landera trzeba ustawić proxy / ten sam origin co API.

## Struktura

```
index.html          # strona główna
articles/           # lista i artykuły SEO
privacy/            # polityka prywatności
assets/             # logo, maskotka, favicon
app.js / i18n.js    # logika + tłumaczenia
styles.css
robots.txt / sitemap.xml
```

## Repo

Wydzielone z monorepo [nutri-frenchy](https://github.com/dariaplutecka/nutri-frenchy) (`web/`).
