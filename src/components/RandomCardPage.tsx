import { Toaster } from "@/components/ui/toaster";
import {
  $isSessionEnded,
  $isSessionStarted,
  $sessionData,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import type { TCard, TOutputCard } from "src/cards.d";
import RandomCardManager from "./RandomCardManager";
import SessionInputCard from "./SessionInputCard";

type Props = {
  cards: TCard[];
  outputCards: TOutputCard[];
};

const RandomCardPage = ({ cards, outputCards }: Props) => {
  // render the card with a switch for is eye tracked, and a session dropdown, and a device number dropdown
  const isSessionStarted = useStore($isSessionStarted);
  const isSessionEnded = useStore($isSessionEnded);
  const sessionData = useStore($sessionData);
  console.table(sessionData);

  // when session ends, commit the session data to the database
  useEffect(() => {
    console.log("isSessionEnded", isSessionEnded);
    if (isSessionEnded) {
      // make a call to /api/sessions with the data and print response
      fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }

    $isSessionEnded.set(false);
  }, [isSessionEnded]);

  return (
    <>
      <div className="space-y-4">
        {!isSessionEnded && isSessionStarted ? (
          <RandomCardManager cards={cards} outputCards={outputCards} />
        ) : (
          <div className="flex h-[80vh] w-full items-center justify-center">
            <SessionInputCard />
          </div>
        )}

        {/* if session ended */}
        {isSessionEnded && (
          <div className="text-center">
            <p className="text-3xl">Session Ended</p>
          </div>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default RandomCardPage;
