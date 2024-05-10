import { atom } from "nanostores";

// there will be more tracked than untracked sessions
export const $isEyeTracked = atom(true);

export const $chosenSession = atom<string | undefined>(undefined);

export const $chosenDevice = atom<string | undefined>(undefined);

export const $isSessionStarted = atom(false);

export const $isSessionEnded = atom(false);

interface ISessionData {
  questionTitle: string;
  chosenAnswer: string;
  flips: number;
}

export const $sessionData = atom<ISessionData[]>([]);

export const $flips = atom(0);
