import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { $flips, type IFlips } from "@/stores/sessionStore";
import { useEffect, useState } from "react";

type Props = {
  title?: string | undefined;
  body?: string | undefined;
  flippable?: boolean | undefined;
  imageFront: ImageMetadata;
  imageBack?: ImageMetadata | undefined;
};

export default function FlippyCard({ title, imageFront, imageBack }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flips, setFlips] = useState<IFlips[]>([]);

  //* this is really really bad practice because of the state setting the state, but it works
  //* we want it to reset the local state when the key outside changes, but also tell us what the number of flips were on the outside (we're using nanostores)
  useEffect(() => {
    $flips.set(flips);
  }, [flips]);

  const handleClick = () => {
    setFlips([...flips, { timestamp: new Date().toISOString() }]);
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <p>
        Currently showing{" "}
        <span className="font-bold">{!isFlipped ? "Front" : "Back"}</span> of{" "}
        <span className="font-bold">{title}</span>
      </p>

      <div
        className={cn("flip-container mx-auto my-4", {
          flip: isFlipped,
        })}
      >
        <div className="flipper">
          <div className="front rounded-lg border shadow-md">
            <p className="text-center font-bold">Front</p>

            <img
              src={imageFront.src}
              alt={title || ""}
              className="h-[95%] w-full object-contain"
            />
          </div>

          <div className="back rounded-lg border shadow-md">
            <p className="text-center font-bold">Back</p>

            {imageBack && (
              <img
                src={imageBack.src}
                alt={title || ""}
                className="h-[95%] w-full object-contain"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <a className={buttonVariants({ variant: "secondary" })} href="/">
          Back to home
        </a>

        <Button onClick={handleClick}>
          {isFlipped ? "Show Front" : "Show Back"}
        </Button>
      </div>
    </div>
  );
}
