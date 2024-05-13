import { db, Session, SessionEvent } from "astro:db";

// https://astro.build/db/seed
export default async function () {
  await db.insert(Session).values([
    {
      id: 1,
      device_identifier: "s1.d1",
      timeStarted: new Date(),
      isEyeTracked: true,
      session_duration: 1000,
    },
    {
      id: 2,
      device_identifier: "s1.d1",
      timeStarted: new Date(),
      isEyeTracked: false,
      session_duration: 10000,
    },
  ]);

  await db.insert(SessionEvent).values([
    {
      id: 1,
      session_id: 1,
      card_title: "Card 1",
      chosen_answer: "yes",
      flips: 2,
      submission_timestamp: new Date(),
      card_idx: 1,
      num_flips: 2,
      starting_timestamp: new Date(),
    },
    {
      id: 2,
      session_id: 1,
      card_title: "Card 2",
      chosen_answer: "unsure",
      flips: 5,
      submission_timestamp: new Date(),
      card_idx: 2,
      num_flips: 5,
      starting_timestamp: new Date(),
    },
  ]);
}
