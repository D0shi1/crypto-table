import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  use: {
    headless: false,
    baseURL: "http://localhost:3000",
    trace: "on",
  },
});
