import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
        chunkSizeWarningLimit: 1480,
    },
});
