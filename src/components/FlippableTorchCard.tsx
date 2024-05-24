import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { $enableDebug } from "@/stores/debugStore";
import {
  $flips,
  $timeSpentBack,
  $timeSpentFront,
  type IFlips,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import type { ImageMetadata } from "astro";
import { useEffect, useRef, useState } from "react";
import TorchCard from "./TorchCard";

type FlippyTorchCardProps = any;

export default function FlippableTorchCard({
  data,
  isDialogOpen,
}: FlippyTorchCardProps) {
  const { title } = data;

  // imageFront may or may not exist
  let image: ImageMetadata | undefined;

  if (data?.imageFront) {
    image = data.imageFront;
  } else {
    image = data.image;
  }

  // imageBack may or may not exist
  let imageBack: ImageMetadata | undefined;

  if (data?.imageBack) {
    imageBack = data.imageBack;
  }

  const [isFlipped, setIsFlipped] = useState(false);
  const [flips, setFlips] = useState<IFlips[]>([]);
  const [timeSpentFront, setTimeSpentFront] = useState(0);
  const [timeSpentBack, setTimeSpentBack] = useState(0);
  const startTime = useRef(new Date());
  const enableDebug = useStore($enableDebug);

  useEffect(() => {
    $flips.set(flips);
  }, [flips]);

  useEffect(() => {
    if (isDialogOpen) return;

    // additional time spent on front, this means that the combined front and back will be equal to the timer selected
    let extraTime = 0;
    if (timeSpentFront > 0) extraTime = 1000;

    $timeSpentFront.set(timeSpentFront + extraTime);
  }, [timeSpentFront]);

  useEffect(() => {
    if (isDialogOpen) return;

    $timeSpentBack.set(timeSpentBack);
  }, [timeSpentBack]);

  const calculateTimeSpent = (flips: IFlips[]) => {
    if (isDialogOpen) return;

    let frontTime = 0;
    let backTime = 0;
    let lastFlipTime = new Date(startTime.current).getTime();
    let currentStateIsFront = true; // Assuming the initial state is front

    flips.forEach((flip) => {
      const flipTime = new Date(flip.timestamp).getTime();
      if (currentStateIsFront) {
        frontTime += flipTime - lastFlipTime;
      } else {
        backTime += flipTime - lastFlipTime;
      }
      lastFlipTime = flipTime;
      currentStateIsFront = !currentStateIsFront;
    });

    // Calculate time from the last flip to now
    const now = new Date().getTime();
    if (currentStateIsFront) {
      frontTime += now - lastFlipTime;
    } else {
      backTime += now - lastFlipTime;
    }

    setTimeSpentFront(frontTime);
    setTimeSpentBack(backTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // don't calculate time spent if the dialog is open
      if (isDialogOpen) return;

      calculateTimeSpent(flips);
    }, 1000);

    return () => clearInterval(interval);
  }, [flips]);

  const handleClick = () => {
    if (!data.flippable) return;

    const newFlip = { timestamp: new Date().toISOString() };
    setFlips([...flips, newFlip]);
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center text-center">
      {enableDebug && (
        <p>
          Currently showing{" "}
          {data.flippable && (
            <>
              <span className="font-bold">{!isFlipped ? "Front" : "Back"}</span>{" "}
              of{" "}
            </>
          )}
          <span className="font-bold">{title}</span>
        </p>
      )}

      <div
        className={cn("flip-container", {
          flip: isFlipped,
        })}
      >
        <div className="flipper">
          <div className="front">{image && <TorchCard image={image} />}</div>

          <div className="back">
            {imageBack && <TorchCard image={imageBack} />}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center space-x-4">
        {enableDebug && (
          <a className={buttonVariants({ variant: "secondary" })} href="/">
            Back to home
          </a>
        )}

        {data.flippable && (
          <Button onClick={handleClick}>
            {isFlipped ? "Show Front" : "Show Back"}
          </Button>
        )}
      </div>
    </div>
  );
}