import { z, defineCollection } from "astro:content";

const flippableCards = defineCollection({
  type: "data", // v2.5.0 and later
  schema: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    imageFront: z.string(),
    imageBack: z.string().optional(),
    flippable: z.boolean().optional(),
  }),
});

export const collections = {
  flippableCards: flippableCards,
};
