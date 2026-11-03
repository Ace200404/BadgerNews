// Load .env into the Expo CLI's process.env; Expo then exposes EXPO_PUBLIC_* vars
// (e.g. EXPO_PUBLIC_CS571_BADGER_ID, used by @cs571/mobile-client) to the app.
require('dotenv/config');

// Keep app.json as the source of truth for the Expo config.
module.exports = ({ config }) => config;
