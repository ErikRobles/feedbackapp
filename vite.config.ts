import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Shorten imports
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"], // Ensure all extensions are resolved
  },
});
