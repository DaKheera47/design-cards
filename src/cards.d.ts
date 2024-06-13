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

export type TTechDeckCardData = CollectionEntry<"technologyCardsDeck">["data"];

// Type guards
export function isTCard(data: TCardData | TOutputCardData): data is TCardData {
  return (data as TCardData).imageFront !== undefined;
}

export function isTOutputCard(
  data:
    | TCardData
    | TOutputCardData
    | (TCardData | TOutputCardData)
    | null
    | undefined,
): data is TOutputCardData {
  if (!data) return false;

  return (data as TOutputCardData).order !== undefined;
}

export function hasAnswersInDeckCard(
  data: TCardData,
): data is CollectionEntry<"technologyCardsDeck">["data"] {
  //! this is typecasing to technologyCardsDeck, but these
  //! aren't the only cards that can have answers
  const answers = (data as CollectionEntry<"technologyCardsDeck">["data"])
    .answers;

  // Check if answers is defined and not an empty array
  return answers !== undefined && answers.length > 0;
}
