import { z, defineCollection } from "astro:content";

const technologyCardsDeck = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      answers: z.array(z.string()),
      body: z.string().optional(),
      imageFront: image(),
      imageBack: image().optional(),
      flippable: z.boolean().optional(),
      num_words_front: z.number().optional(),
      num_words_back: z.number().optional(),
    }),
});

const technologyCardsOutput = defineCollection({
  type: "data",
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
  type: "data",
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

const magicCardsOutput = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      image: image(),
      flippable: z.boolean().optional(),
      order: z.number().min(1),
    }),
});

const functionCardsDeck = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      answers: z.array(z.string()),
      body: z.string().optional(),
      image: image(),
      words: z.string().optional(),
      flippable: z.boolean().optional(),
      word_count: z.number().optional(),
    }),
});

const functionCardsOutput = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      image: image(),
      flippable: z.boolean().optional(),
      order: z.number().min(1),
    }),
});

export const collections = {
  technologyCardsDeck,
  technologyCardsOutput,
  magicCardsDeck,
  magicCardsOutput,
  functionCardsDeck,
  functionCardsOutput,
};
