import { z, defineCollection } from "astro:content";

const flippableCards = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      imageFront: image(),
      imageBack: image().optional(),
      flippable: z.boolean().optional(),
    }),
});

export const collections = {
  flippableCards,
};
