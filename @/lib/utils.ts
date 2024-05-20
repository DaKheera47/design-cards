import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(
  str: string | undefined,
  length: number,
  start = 10,
  end = 10,
  separator = "...",
) {
  if (!str) return "";

  if (str.length <= length) return str;

  // return the first and last 5 characters
  return str.slice(0, start) + ` ${separator} ` + str.slice(-end);
}
