import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    env: {
      NODE_ENV: "test",
      PHOTO_ALBUM_DB: "data/e2e-photo-albums.sqlite"
    }
  },
  use: {
    baseURL: "http://127.0.0.1:5173"
  }
});
