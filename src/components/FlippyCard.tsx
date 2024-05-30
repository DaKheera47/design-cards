import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { $enableDebug } from "@/stores/debugStore";
import {
  $flips,
  $imageBBox,
  $timeSpentBack,
  $timeSpentFront,
  type IFlips,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import type { ImageMetadata } from "astro";
import { useEffect, useRef, useState } from "react";
import TorchCard from "./TorchCard";

type FlippyCardProps = {
  data: any;
  isDialogOpen: boolean;
  useTorchCard?: boolean;
};

export default function FlippyCard({
  data,
  isDialogOpen,
  useTorchCard = false,
}: FlippyCardProps) {
  const { title } = data;
  const imageRef = useRef<HTMLImageElement>(null);

  // imageFront may or may not exist
  let image: ImageMetadata | undefined = data?.imageFront || data.image;
  // imageBack may or may not exist
  let imageBack: ImageMetadata | undefined = data?.imageBack;

  // set the size of the image bounding box
  useEffect(() => {
    const imageBBox = imageRef.current?.getBoundingClientRect();
    if (!imageBBox) return;

    // if any of the values are 0, don't c
    if (
      imageBBox.x === 0 ||
      imageBBox.y === 0 ||
      imageBBox.width === 0 ||
      imageBBox.height === 0
    )
      return;

    $imageBBox.set({
      x: imageBBox.x,
      y: imageBBox.y,
      width: imageBBox.width,
      height: imageBBox.height,
      top: imageBBox.top,
      right: imageBBox.right,
      bottom: imageBBox.bottom,
      left: imageBBox.left,
    });
  }, []);

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
    let currentStateIsFront = true;

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

  const renderCardContent = (
    image: ImageMetadata | undefined,
    side: "front" | "back",
  ) => {
    if (useTorchCard && image) {
      return <TorchCard innerRef={imageRef} image={image} side={side} />;
    }

    return (
      <img
        ref={side === "front" ? imageRef : null}
        src={image?.src}
        alt={title || ""}
        className="my-auto h-[90%] w-full object-contain"
      />
    );
  };

  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center space-x-6 text-center">
      {enableDebug && (
        <p className="text-right">
          {data.flippable && (
            <>
              <span className="font-bold">{!isFlipped ? "Front" : "Back"}</span>{" "}
              of{" "}
            </>
          )}
          <span className="font-bold">{title}</span>
        </p>
      )}

      <div className={cn("flip-container", { flip: isFlipped })}>
        <div className="flipper">
          <div className="front">
            {data.flippable && (
              <p className="w-full text-center font-bold">Front</p>
            )}
            {renderCardContent(image, "front")}
          </div>

          <div className="back">
            {data.flippable && (
              <p className="w-full text-center font-bold">Back</p>
            )}
            {renderCardContent(imageBack, "back")}
          </div>
        </div>
      </div>

      {data.flippable && (
        <div className="flex w-full justify-center space-x-4">
          {enableDebug && (
            <a className={buttonVariants({ variant: "secondary" })} href="/">
              Back to home
            </a>
          )}

          <Button onClick={handleClick}>
            {isFlipped ? "Show Front" : "Show Back"}
          </Button>
        </div>
      )}
    </div>
  );
}
