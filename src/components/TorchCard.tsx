import { $enableDebug } from "@/stores/debugStore";
import { $mousePos, $torchSize } from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import type { ImageMetadata } from "astro";
import React, { useEffect } from "react";

type Props = {
  image: ImageMetadata;
  side: "front" | "back";
  innerRef?: React.RefObject<HTMLImageElement>;
};

const TorchCard = ({ image, side, innerRef }: Props) => {
  // how often to store the mouse pos
  const MOUSE_POS_POLLING_RATE = 10;
  // if the mouse is out of bounds, store this value to make it go off screen
  const MOUSE_OUT_OF_BOUNDS_POS = -1000;

  const torchImageRef = React.useRef<HTMLDivElement>(null);

  // where the mouse is, large negative number to start with so it starts off screen
  const [mouseX, setMouseX] = React.useState(MOUSE_OUT_OF_BOUNDS_POS);
  const [mouseY, setMouseY] = React.useState(MOUSE_OUT_OF_BOUNDS_POS);
  // what the shape of the area being revealed is
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const enableDebug = useStore($enableDebug);
  const torchSize = useStore($torchSize);

  useEffect(() => {
    const storeMousePos = () => {
      const timestamp = new Date().toISOString();
      const x = mouseX;
      const y = mouseY;

      // if the x or y is in its initial value, don't store it
      if (x === MOUSE_OUT_OF_BOUNDS_POS || y === MOUSE_OUT_OF_BOUNDS_POS)
        return;

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

      setMouseX(mouseX);
      setMouseY(mouseY);
    };

    const handleMouseLeave = () => {
      setMouseX(MOUSE_OUT_OF_BOUNDS_POS);
      setMouseY(MOUSE_OUT_OF_BOUNDS_POS);
    };

    torchImageRef.current?.addEventListener("mousemove", handleMouse);
    torchImageRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      torchImageRef.current?.removeEventListener("mousemove", handleMouse);
      torchImageRef.current?.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
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

        $torchSize.set(torchSize + 10);
      } else if (event.key === "ArrowDown") {
        // prevent the page from being scrolled
        event.preventDefault();

        $torchSize.set(torchSize - 10);
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
        className="drag-none pointer-events-none inset-0 min-h-[60vh] w-full select-none object-cover"
        src={image.src}
        alt={image.src}
        ref={innerRef ? innerRef : undefined}
        draggable={false}
      />

      {/* Outline for the mask */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          borderRadius: "50%",
          border:
            mouseX === MOUSE_OUT_OF_BOUNDS_POS ||
            mouseY === MOUSE_OUT_OF_BOUNDS_POS
              ? "none"
              : "2px solid black",
          top: mouseY - torchSize / (scaleFactor * 2),
          left: mouseX - torchSize / 2,
          width: torchSize,
          height: torchSize / scaleFactor,
        }}
      />

      {/* Top layer: the mask that covers the image */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r text-white"
        style={{
          WebkitMaskImage: `radial-gradient(${torchSize}px ${torchSize / scaleFactor}px at ${mouseX}px ${mouseY}px, transparent 0%, transparent 50%, black 50%, black 100%)`,
          maskImage: `radial-gradient(${torchSize}px ${torchSize / scaleFactor}px at ${mouseX}px ${mouseY}px, transparent 0%, transparent 50%, black 50%, black 100%)`,
          backdropFilter: "blur(20px)",
        }}
      />
    </div>
  );
};

export default TorchCard;
