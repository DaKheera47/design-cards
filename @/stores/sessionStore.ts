import { atom } from "nanostores";

// there will be more tracked than untracked sessions
export const $isEyeTracked = atom(true);

export const $chosenSession = atom<string | undefined>(undefined);

export const $chosenDevice = atom<string | undefined>(undefined);

export const $isSessionStarted = atom(false);

export const $isSessionEnded = atom(false);

// this means that the length of the array will be the number of flips
export interface IFlips {
  timestamp: string;
}

export const $flips = atom<IFlips[]>([]);

export interface ISessionData {
  cardTitle: string;
  chosenAnswer: string;
  flips: IFlips[];
  session: string;
  device: string;
  submission_timestamp: string;
  isEyeTracked: boolean;
  cardIdx: number;
}

export const $sessionData = atom<ISessionData[]>([]);
