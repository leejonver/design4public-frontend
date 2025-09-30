import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${path.resolve(__dirname, "./")}/`,
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts", "./jest.setup.ts"],
    reporters: process.env.CI ? ["github", "default"] : ["default"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
