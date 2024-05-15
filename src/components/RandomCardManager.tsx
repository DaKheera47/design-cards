import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { $enableDebug } from "@/stores/debugStore";
import {
  $chosenDevice,
  $chosenSession,
  $flips,
  $isEyeTracked,
  $isSessionEnded,
  $isSessionStarted,
  $sessionData,
  $start_timestamp,
  $timeSpentBack,
  $timeSpentFront,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import type { TCard, TOutputCard } from "src/cards";
import CardConfirmationDialog from "./CardConfirmationDialog";
import FlippyCard from "./FlippyCard";

type Props = {
  cards: TCard[];
  outputCards: TOutputCard[];
};

const DEFAULT_CARD_FLIP_TIMER = 30000;

const RandomCardManager = ({ cards, outputCards }: Props) => {
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [randomisedCards, setRandomisedCards] = useState<
    (TCard | TOutputCard)[]
  >([]);
  const [cardFlipTimer, setCardFlipTimer] = useState(DEFAULT_CARD_FLIP_TIMER);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isSessionEnded = useStore($isSessionEnded);
  const isEyeTracked = useStore($isEyeTracked);
  const chosenDevice = useStore($chosenDevice);
  const chosenSession = useStore($chosenSession);
  const sessionData = useStore($sessionData);
  const flips = useStore($flips);
  const start_timestamp = useStore($start_timestamp);
  const enableDebug = useStore($enableDebug);
  const timeSpentFront = useStore($timeSpentFront);
  const timeSpentBack = useStore($timeSpentBack);

  // randomise the cards on mount
  useEffect(() => {
    setRandomisedCards([
      ...cards.sort(() => Math.random() - 0.5),
      ...outputCards.sort(() => Math.random() - 0.5),
    ]);

    // set the start timestamp
    $start_timestamp.set(new Date().toISOString());
  }, []);

  // show the dialog after the card flip timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsDialogOpen(true);
    }, cardFlipTimer);

    return () => clearInterval(intervalId);
  }, [activeCardIdx, cardFlipTimer, randomisedCards]);

  // handle the card flip timer change in debug mode
  const handleCardFlipTimerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    setCardFlipTimer(value);
  };

  // called when the user chooses an answer
  const handleDialogClose = (chosenAnswer: "yes" | "no" | "unsure") => {
    setIsDialogOpen(false);

    setActiveCardIdx((activeCardIdx) => {
      const nextIdx = activeCardIdx + 1;

      // regex to get only the numbers from the session name
      const sessionNumber = chosenSession?.match(/\d+/g);
      const deviceNumber = chosenDevice?.match(/\d+/g);

      let tempStart: any = "";
      if (sessionData.length === 0) {
        console.log("Session Data is empty");
        console.log(sessionData);
        tempStart = start_timestamp;
      } else {
        tempStart = sessionData[sessionData.length - 1].submission_timestamp;
      }

      $sessionData.set([
        ...sessionData,
        {
          cardTitle: randomisedCards[activeCardIdx].data.title ?? "",
          chosenAnswer,
          flips,
          session: chosenSession ?? "",
          device: chosenDevice ?? "",
          starting_timestamp: tempStart,
          submission_timestamp: new Date().toISOString(),
          isEyeTracked,
          cardIdx: activeCardIdx,
          time_spent_front: timeSpentFront,
          time_spent_back: timeSpentBack,
        },
      ]);

      if (nextIdx < randomisedCards.length) {
        return nextIdx;
      }

      // this means we have reached the end of the cards
      $isSessionEnded.set(true);
      console.log("Session Ended", isSessionEnded);

      toast({
        title: "Session Ended.",
        description: `Thanks for participating. ${
          isEyeTracked &&
          `Eye tracking filename: ${sessionNumber}.${deviceNumber}`
        }`,
      });

      // reset the session
      $isSessionStarted.set(false);

      return -1;
    });
  };

  if (
    (randomisedCards.length !== 0 && activeCardIdx === null) ||
    activeCardIdx >= randomisedCards.length
  ) {
    return null;
  }

  if (isSessionEnded) return null;

  return (
    <>
      <div className="flex space-x-4">
        <h1>Enable Debug Mode</h1>
        <Switch
          checked={enableDebug}
          onCheckedChange={() => {
            $enableDebug.set(!enableDebug);
          }}
        />
      </div>

      {enableDebug && (
        <div className="my-8 space-y-4 border p-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="cardFlipTimer">Card Flip Timer (ms)</label>
            <Input
              id="cardFlipTimer"
              type="number"
              className="w-24"
              value={cardFlipTimer}
              onChange={handleCardFlipTimerChange}
            />
          </div>

          <div className="mt-4">
            <p>Time spent on front: {timeSpentFront}ms</p>
            <p>Time spent on back: {timeSpentBack}ms</p>
          </div>

          {activeCardIdx !== null && (
            <>
              {randomisedCards[activeCardIdx] && (
                <h2>
                  Current Card - {randomisedCards[activeCardIdx]?.data?.title}
                </h2>
              )}

              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {randomisedCards.map((card, index) => (
                  <li
                    key={card.id}
                    style={{
                      fontWeight: index === activeCardIdx ? "bold" : "normal",
                    }}
                  >
                    {card.data.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <FlippyCard
        key={randomisedCards[activeCardIdx].id}
        {...randomisedCards[activeCardIdx]}
        isDialogOpen={isDialogOpen}
      />

      <CardConfirmationDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Continue?"
        description="Did you understand what was written on the card?"
        onClose={handleDialogClose}
      />
    </>
  );
};

export default RandomCardManager;
