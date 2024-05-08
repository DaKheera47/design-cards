import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  adapter: vercel({
    imageService: true,
  }),
  site: "https://design-cards.vercel.app/",
});
