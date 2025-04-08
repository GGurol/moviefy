import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5174, // This is the port which we will use in docker
    hmr: {
      overlay: false, // This is to disable the overlay error message
    },
    allowedHosts: ["movie.linze.pro"],
  },
});
