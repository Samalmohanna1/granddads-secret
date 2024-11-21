import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
        chunkSizeWarningLimit: 1470,
        rollupOptions: {
            plugins: [
                visualizer({
                    open: true, // Automatically opens the report in your browser
                    filename: "stats.html", // Specify a custom filename if desired
                    template: "treemap", // Optional: choose a different template (e.g., 'sunburst', 'network')
                }),
            ],
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
});
