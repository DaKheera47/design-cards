import { Toaster } from "@/components/ui/toaster";
import { $isSessionEnded, $isSessionStarted } from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import type { CollectionEntry } from "astro:content";
import RandomCardManager from "./RandomCardManager";
import SessionInputCard from "./SessionInputCard";

type TCard = CollectionEntry<"flippableCards">;

type Props = {
  cards: TCard[];
};

const RandomCardPage = ({ cards }: Props) => {
  // render the card with a switch for is eye tracked, and a session dropdown, and a device number dropdown
  const isSessionStarted = useStore($isSessionStarted);
  const isSessionEnded = useStore($isSessionEnded);

  return (
    <>
      <div className="flex h-[90vh] flex-wrap items-center justify-center">
        <div className="space-y-8">
          {!isSessionEnded && isSessionStarted ? (
            <RandomCardManager cards={cards} />
          ) : (
            <SessionInputCard />
          )}

          {/* if session ended */}
          {isSessionEnded && (
            <div className="text-center">
              <p className="text-3xl">Session Ended</p>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default RandomCardPage;
