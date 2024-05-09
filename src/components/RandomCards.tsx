import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CollectionEntry } from "astro:content";
import { useEffect, useState } from "react";
import CardConfirmationDialog from "./CardConfirmationDialog";
import FlippyCard from "./FlippyCard";

type TCard = CollectionEntry<"flippableCards">;

type Props = {
  cards: TCard[];
};

const DEFAULT_CARD_FLIP_TIMER = 30000;

const IndexPage = ({ cards }: Props) => {
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [randomisedCards, setRandomisedCards] = useState<TCard[]>([]);
  const [enableDebug, setEnableDebug] = useState(false);
  const [cardFlipTimer, setCardFlipTimer] = useState(DEFAULT_CARD_FLIP_TIMER);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setRandomisedCards(cards.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (enableDebug) {
        console.log("Flipping card");
        console.log("Active card index", activeCardIdx);
      }
      setIsDialogOpen(true);
    }, cardFlipTimer);

    return () => clearInterval(intervalId);
  }, [activeCardIdx, cardFlipTimer, randomisedCards]);

  const handleCardFlipTimerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    setCardFlipTimer(value);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveCardIdx((activeCardIdx) => {
      const nextIdx = activeCardIdx + 1;
      return nextIdx < randomisedCards.length ? nextIdx : 0;
    });
  };

  if (
    (randomisedCards.length !== 0 && activeCardIdx === null) ||
    activeCardIdx >= randomisedCards.length
  ) {
    return null;
  }

  return (
    <>
      <div className="flex space-x-4">
        <h1>Enable Debug Mode</h1>
        <Switch checked={enableDebug} onCheckedChange={setEnableDebug} />
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
          {activeCardIdx !== null && (
            <>
              <h2>
                Current Card - {randomisedCards[activeCardIdx].data.title}
              </h2>
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
        {...randomisedCards[activeCardIdx].data}
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

export default IndexPage;
