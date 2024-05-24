import { $enableDebug } from "@/stores/debugStore";
import { $mousePos } from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import type { ImageMetadata } from "astro";
import React, { useEffect } from "react";

type Props = {
  image: ImageMetadata;
  side: "front" | "back";
};

const TorchCard = ({ image, side }: Props) => {
  const torchImageRef = React.useRef<HTMLDivElement>(null);

  // where the mouse is, large negative number to start with so it starts off screen
  const [mouseX, setMouseX] = React.useState(-1000);
  const [mouseY, setMouseY] = React.useState(-1000);
  // what the size of the gradient is
  const [gradientSize, setGradientSize] = React.useState(150);
  // what the shape of the gradient is
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const enableDebug = useStore($enableDebug);

  // how often to store the mouse pos
  const MOUSE_POS_POLLING_RATE = 10;

  useEffect(() => {
    const storeMousePos = () => {
      const timestamp = new Date().toISOString();
      const x = mouseX;
      const y = mouseY;

      // if the x or y is in it's initial value, don't store it
      if (x === -1000 || y === -1000) return;

      // if a value with the same x and y already exists, don't add it
      if ($mousePos.get().find((pos) => pos.x === x && pos.y === y)) return;

      $mousePos.set([...$mousePos.get(), { x, y, timestamp, side }]);
    };

    const intervalId = setInterval(storeMousePos, MOUSE_POS_POLLING_RATE);

    return () => clearInterval(intervalId);
  }, [mouseX, mouseY, side]);

  useEffect(() => {
    // get mouse pos from document
    const handleMouse = (event: MouseEvent) => {
      const card = torchImageRef.current;
      if (!card) return;

      const { top, left } = card.getBoundingClientRect();
      const mouseX = event.clientX - left;
      const mouseY = event.clientY - top;

      // TODO: add a check to see if the mouse is outside the card,
      // TODO: if so, set the mouse pos to -1000

      setMouseX(mouseX);
      setMouseY(mouseY);
    };

    torchImageRef.current?.addEventListener("mousemove", handleMouse);

    return () => {
      torchImageRef.current?.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // don't do anything if not admin
      if (!enableDebug) return;

      // up down controls the size of the gradient
      // left right controls the scale factor, which affects the shape of the gradient
      if (event.key === "ArrowUp") {
        // prevent the page from being scrolled
        event.preventDefault();

        setGradientSize((size) => size + 10);
      } else if (event.key === "ArrowDown") {
        // prevent the page from being scrolled
        event.preventDefault();

        setGradientSize((size) => size - 10);
      } else if (event.key === "ArrowRight") {
        // prevent the page from being scrolled
        event.preventDefault();

        setScaleFactor((factor) => factor + 0.1);
      } else if (event.key === "ArrowLeft") {
        // prevent the page from being scrolled
        event.preventDefault();

        setScaleFactor((factor) => factor - 0.1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableDebug]);

  return (
    <div
      ref={torchImageRef}
      className="relative mx-auto min-h-[60vh] overflow-hidden"
    >
      <img
        className="pointer-events-none inset-0 min-h-[60vh] w-full select-none object-cover"
        src={image.src}
        alt={image.src}
      />

      {/* Outline for the mask */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          borderRadius: "50%",
          border: "2px solid black",
          top: mouseY - gradientSize / (scaleFactor * 2),
          left: mouseX - gradientSize / 2,
          width: gradientSize,
          height: gradientSize / scaleFactor,
        }}
      />

      {/* Top layer: the mask that covers the image */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r text-white"
        style={{
          WebkitMaskImage: `radial-gradient(${gradientSize}px ${gradientSize / scaleFactor}px at ${mouseX}px ${mouseY}px, transparent 0%, transparent 50%, black 50%, black 100%)`,
          maskImage: `radial-gradient(${gradientSize}px ${gradientSize / scaleFactor}px at ${mouseX}px ${mouseY}px, transparent 0%, transparent 50%, black 50%, black 100%)`,
          backdropFilter: "blur(20px)",
        }}
      />
    </div>
  );
};

export default TorchCard;
