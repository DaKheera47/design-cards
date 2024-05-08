import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

type Props = {
  title?: string | undefined;
  body?: string | undefined;
  flippable?: boolean | undefined;
  imageFront: ImageMetadata;
  imageBack?: ImageMetadata | undefined;
};

export default function FlippyCard({ title, imageFront, imageBack }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mx-auto max-w-md text-center">
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
              className="h-5/6 w-full object-contain"
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
