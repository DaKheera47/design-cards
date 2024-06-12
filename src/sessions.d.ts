import { Session, SessionEvent } from "astro:db";

type TSession = typeof Session.$inferSelect;
type TSessionEvent = typeof SessionEvent.$inferSelect;

export type TSessionWithEvents = TSession & {
  events: TSessionEvent[];
};
