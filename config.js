/**
 * Konfiguracja landera.
 *
 * apiBaseUrl:
 * - "" (puste) → to samo origin (lokalnie z FastAPI / reverse proxy)
 * - "https://api.example.com" → osobny backend (osobny hosting landera)
 *
 * appStoreUrl:
 * - link do aplikacji w App Store (np. https://apps.apple.com/app/id123456789)
 * - ustaw po publikacji; wszystkie przyciski „Pobierz” kierują tutaj
 *
 * Nie dodawaj końcowego slasha.
 */
window.LANDING_CONFIG = {
  apiBaseUrl: "",
  appStoreUrl: "",
};
