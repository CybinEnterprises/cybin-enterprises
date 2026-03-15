import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import environment from "vite-plugin-environment";
import path from "path";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.ic0.app/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          three: ['@react-three/fiber', 'three'],
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    environment(["VITE_USE_MOCK"], { default: "false" }),
    react(),
  ],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/components/primitives": path.resolve(__dirname, "./shared/ui"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/pages": path.resolve(__dirname, "./pages"),
      "@/widgets": path.resolve(__dirname, "./widgets"),
      "@/shared": path.resolve(__dirname, "./shared"),
      "@/data": path.resolve(__dirname, "./data"),
      "@/declarations": path.resolve(__dirname, "./declarations"),
      "@/mocks": path.resolve(__dirname, "./mocks"),
      "@": path.resolve(__dirname, "./"),
    },
    dedupe: ["@dfinity/agent"],
  },
});