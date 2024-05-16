import type { CollectionEntry } from "astro:content";

export type TCard =
  | CollectionEntry<"technologyCardsDeck">
  | CollectionEntry<"magicCardsDeck">;
export type TCardData =
  | CollectionEntry<"technologyCardsDeck">["data"]
  | CollectionEntry<"magicCardsDeck">["data"];
export type TOutputCard = CollectionEntry<"technologyCardsOutput">;
export type TOutputCardData = CollectionEntry<"technologyCardsOutput">["data"];

// Type guards
export function isTCard(data: TCardData | TOutputCardData): data is TCardData {
  return (data as TCardData).imageFront !== undefined;
}

export function isTOutputCard(
  data: TCardData | TOutputCardData,
): data is TOutputCardData {
  return (data as TOutputCardData).image !== undefined;
}
