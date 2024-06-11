import { atom } from "nanostores";

// there will be more tracked than untracked sessions
export const $isEyeTracked = atom(false);

export const $chosenSession = atom<string | undefined>(undefined);

export const $chosenDevice = atom<string | undefined>(undefined);

export const $isSessionStarted = atom(false);

export const $isSessionEnded = atom(false);

// what the size of the area being revealed is
export const $torchSize = atom(150);

export interface IMousePos {
  x: number;
  y: number;
  timestamp: string;
  side: "front" | "back";
}

export const $mousePos = atom<IMousePos[]>([]);

// this means that the length of the array will be the number of flips
export interface IFlips {
  timestamp: string;
}

export const $flips = atom<IFlips[]>([]);
export const $timeSpentFront = atom(0);
export const $timeSpentBack = atom(0);

interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const $imageBBox = atom<IBoundingBox>({
  x: -1,
  y: -1,
  width: -1,
  height: -1,
  top: -1,
  right: -1,
  bottom: -1,
  left: -1,
});

export interface IBrowserInfo {
  imageBBox: IBoundingBox;
  windowWidth: number;
  windowHeight: number;
  torchSize: number;
}

export interface ISessionData {
  cardTitle: string;
  chosenAnswer: string;
  flips: IFlips[];
  session: string;
  device: string;
  starting_timestamp: string;
  submission_timestamp: string;
  isEyeTracked: boolean;
  cardIdx: number;
  time_spent_front: number;
  time_spent_back: number;
  page_url: string;
  mouse_pos: IMousePos[];
  browserInfo: IBrowserInfo;
}

export const $sessionData = atom<ISessionData[]>([]);

export const $start_timestamp = atom<string | undefined>(undefined);
