import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <div>
      <div className={cn("flip-container", { flip: isFlipped })}>
        <div className="flipper">
          <div className="front">
            <h2>{title} -- Front</h2>
            <img
              src={imageFront.src}
              alt={title || ""}
              width={300}
              height={300}
            />
          </div>

          <div className="back">
            <h2>{title} -- Back</h2>
            {imageBack && (
              <img
                src={imageBack.src}
                alt={title || ""}
                width={300}
                height={300}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Flip
      </button>
    </div>
  );
}
