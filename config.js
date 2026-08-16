/**
 * Konfiguracja landera.
 *
 * apiBaseUrl:
 * - "" (puste) → to samo origin; na produkcji /api/* jest proxy do Railway (_redirects)
 * - "https://heroic-simplicity-production.up.railway.app" → bezpośrednio backend
 *
 * appStoreUrl:
 * - link do aplikacji w App Store (np. https://apps.apple.com/app/id123456789)
 * - ustaw po publikacji; wszystkie przyciski „Pobierz” kierują tutaj
 *
 * Nie dodawaj końcowego slasha.
 */
window.LANDING_CONFIG = {
  apiBaseUrl: "https://heroic-simplicity-production.up.railway.app",
  appStoreUrl: "",
};
