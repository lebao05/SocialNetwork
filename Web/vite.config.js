import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync("./web-privateKey.key"),
      cert: fs.readFileSync("./web.crt"),
    },
    port: 5173,
    host: "localhost",
  },
});
