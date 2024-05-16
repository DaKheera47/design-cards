import { z, defineCollection } from "astro:content";

const technologyCardsDeck = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      imageFront: image(),
      imageBack: image().optional(),
      flippable: z.boolean().optional(),
      num_words_front: z.number().optional(),
      num_words_back: z.number().optional(),
    }),
});

const technologyCardsOutput = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      image: image(),
      flippable: z.boolean().optional(),
      order: z.number().min(1),
    }),
});

const magicCardsDeck = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      image: image(),
      words: z.string().optional(),
      flippable: z.boolean().optional(),
      word_count: z.number().optional(),
    }),
});

export const collections = {
  technologyCardsDeck,
  technologyCardsOutput,
  magicCardsDeck,
};
