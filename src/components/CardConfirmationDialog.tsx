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

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  onClose: (chosenAnswer: "yes" | "no" | "unsure") => void;
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

export default function CardConfirmationDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onClose,
}: Props) {
  const buttons = useMemo(
    () => [{ label: "yes" }, { label: "no" }, { label: "unsure" }],
    [setIsOpen],
  );
  const sessionData = useStore($sessionData);

  // memoize the shuffled array, and change when the card data changes
  const shuffledArray = useMemo(() => shuffleArray(buttons), [sessionData]);

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
          <DialogPanel className="max-w-lg space-y-4 bg-card rounded-md border p-12">
            {title && (
              <DialogTitle className="font-bold capitalize">
                {title}
              </DialogTitle>
            )}

            {description && (
              <Description className="capitalize">{description}</Description>
            )}

            <div className="grid grid-cols-3 gap-4">
              {shuffledArray.map(({ label }) => (
                <Button
                  variant="outline"
                  key={label}
                  onClick={() => {
                    setIsOpen(false);
                    onClose(label as "yes" | "no" | "unsure");
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
