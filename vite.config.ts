import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the repo name for GitHub Pages project-site hosting:
// https://finnastle-lab.github.io/un-write/
export default defineConfig({
  base: "/un-write/",
  plugins: [react()],
});
