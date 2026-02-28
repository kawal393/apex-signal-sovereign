import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// APEX INFRASTRUCTURE - Removed Lovable tagger

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    allowedHosts: [
      '380ede9391907e7c-117-102-149-225.serveousercontent.com',
      '.serveo.net',
      '.loca.lt'
    ],
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
