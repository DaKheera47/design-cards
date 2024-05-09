import { Button } from "@/components/ui/button";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useMemo } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  onClose: () => void;
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
    () => [{ label: "Yes" }, { label: "No" }, { label: "Unsure" }],
    [setIsOpen],
  );

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
          <DialogPanel className="max-w-lg space-y-4 rounded-md border bg-white p-12">
            {title && <DialogTitle className="font-bold">{title}</DialogTitle>}
            {description && <Description>{description}</Description>}

            <div className="grid grid-cols-3 gap-4">
              {shuffleArray(buttons).map(({ label }) => (
                <Button variant="outline" key={label} onClick={onClose}>
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
