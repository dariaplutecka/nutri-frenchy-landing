/**
 * Konfiguracja landera.
 *
 * apiBaseUrl:
 * - "" (puste) → to samo origin (lokalnie z FastAPI / reverse proxy)
 * - "https://api.example.com" → osobny backend (osobny hosting landera)
 *
 * Nie dodawaj końcowego slasha.
 */
window.LANDING_CONFIG = {
  apiBaseUrl: "",
};
