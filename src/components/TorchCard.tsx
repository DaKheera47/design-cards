import { $enableDebug } from "@/stores/debugStore";
import { useStore } from "@nanostores/react";
import type { ImageMetadata } from "astro";
import React, { useEffect } from "react";

type Props = {
  image: ImageMetadata;
};

const TorchCard = ({ image }: Props) => {
  const torchImageRef = React.useRef<HTMLDivElement>(null);

  // where the mouse is
  const [mouseX, setMouseX] = React.useState(50);
  const [mouseY, setMouseY] = React.useState(50);
  const [gradientSize, setGradientSize] = React.useState(300);
  const [scaleFactor, setScaleFactor] = React.useState(2);
  const enableDebug = useStore($enableDebug);

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

    torchImageRef.current?.addEventListener("mousemove", handleMouse);
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
      className="relative mx-auto min-h-[60vh] overflow-hidden border border-white"
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
