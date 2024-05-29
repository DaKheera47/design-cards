import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
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
        .then((res) => {
          if (res.status === 200) {
            // send a success toast
            toast({
              title: "Data Submitted.",
            });

            // reset the session data because
            // the session has ended, and the data has been submitted
            $isSessionStarted.set(false);
            $sessionData.set([]);
          } else {
            // send an error toast
            toast({
              title:
                // TODO: Add a link to download the data
                "Error submitting data. Please download the data manually.",
              variant: "destructive",
            });

            // don't reset the session data because
            // the data has not been submitted
          }

          res.json();
        })
        .then((data) => console.log(data));
    }
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
        {/* // TODO: Add a link to download the data */}
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
