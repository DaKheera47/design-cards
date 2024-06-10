import { Button } from "@/components/ui/button";
import { $sessionData } from "@/stores/sessionStore";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";
import {
  isTOutputCard,
  isTechnologyDeckCard,
  type TCard,
  type TOutputCard,
  type TTechDeckCardData,
} from "src/cards.d";

type Props = {
  cards: TCard[];
  currentCard: TCard | TOutputCard;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string[];
  onClose: (chosenAnswer: string) => void;
};

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

// Helper function to get a random element from an array
const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export default function CardConfirmationDialog({
  cards,
  currentCard,
  isOpen,
  setIsOpen,
  title,
  description,
  onClose,
}: Props) {
  const sessionData = useStore($sessionData);

  const cardsData = cards.map(
    (card) => card.data,
  ) as unknown as TTechDeckCardData[];

  const answers = cardsData.map((card) => {
    return {
      label: getRandomElement(card.answers),
      cardId: cards.find((c) => c.data === card)?.id,
    };
  });

  let _currentCard: TTechDeckCardData = currentCard.data as TTechDeckCardData;

  // Ensure we have only 3 options, including the correct answer
  const selectedAnswers = useMemo(() => {
    //* this means that only the first answer in
    //* the answers array is correct and shown.
    const correctAnswer = _currentCard.answers[0];
    // get a list of answers without duplicates
    const uniqueAnswers = Array.from(new Set(answers.map((a) => a.label)));

    // make a list of all the answers except the correct one
    const filteredAnswers = uniqueAnswers.filter(
      (answer) => answer !== correctAnswer,
    );

    // shuffle the list and take 2 random answers
    const randomAnswers = shuffleArray(filteredAnswers).slice(0, 2);
    // shuffle the list of answers and add the correct answer to display
    return shuffleArray([correctAnswer, ...randomAnswers]);
  }, [sessionData]);

  //! if it's an output card, we don't need to show the dialog
  if (isTOutputCard(currentCard.data)) return;

  //! This means that the card doesn't work for anything
  //! except for the technology deck cards
  if (!isTechnologyDeckCard(cards[0].data)) return;

  return (
    <Transition
      show={isOpen}
      enter="duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="duration-200 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* on close is empty to prevent clicking off without choosing an option */}
      <Dialog onClose={() => {}} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-2xl space-y-4 rounded-md border bg-card p-12">
            {title && (
              <DialogTitle className="font-bold capitalize">
                {title}
              </DialogTitle>
            )}

            {description && description.length > 0 && (
              <Description className="capitalize">
                {getRandomElement(description)}
              </Description>
            )}

            <div className="grid grid-cols-3 gap-4">
              {selectedAnswers.map((label) => (
                <Button
                  key={label}
                  onClick={() => {
                    setIsOpen(false);
                    onClose(label);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
