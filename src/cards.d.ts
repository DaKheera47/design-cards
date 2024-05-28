import type { CollectionEntry } from "astro:content";

export type TCard =
  | CollectionEntry<"technologyCardsDeck">
  | CollectionEntry<"functionCardsDeck">
  | CollectionEntry<"magicCardsDeck">;
export type TCardData =
  | CollectionEntry<"technologyCardsDeck">["data"]
  | CollectionEntry<"functionCardsDeck">["data"]
  | CollectionEntry<"magicCardsDeck">["data"];
export type TOutputCard =
  | CollectionEntry<"technologyCardsOutput">
  | CollectionEntry<"functionCardsOutput">
  | CollectionEntry<"magicCardsOutput">;
export type TOutputCardData =
  | CollectionEntry<"technologyCardsOutput">["data"]
  | CollectionEntry<"functionCardsOutput">["data"]
  | CollectionEntry<"magicCardsOutput">["data"];

// Type guards
export function isTCard(data: TCardData | TOutputCardData): data is TCardData {
  return (data as TCardData).imageFront !== undefined;
}

export function isTOutputCard(
  data: TCardData | TOutputCardData | (TCardData | TOutputCardData),
): data is TOutputCardData {
  return (data as TOutputCardData).order !== undefined;
}
