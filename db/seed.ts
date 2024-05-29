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
      browserInfo: {
        imageBBox: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
    {
      id: 2,
      device_identifier: "s1.d1",
      timeStarted: new Date(),
      isEyeTracked: false,
      session_duration: 10000,
      browserInfo: {
        imageBBox: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
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
      time_spent_back: 1000,
      time_spent_front: 1000,
      page_url: "https://design-cards.vercel.app/magic-cards/study",
      mouse_pos: [
        {
          x: 100,
          y: 100,
          timestamp: new Date(),
          side: "front",
        },
      ],
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
      time_spent_back: 1000,
      time_spent_front: 1000,
      page_url: "https://design-cards.vercel.app/technology-cards/study",
      mouse_pos: [
        {
          x: 100,
          y: 100,
          timestamp: new Date(),
          side: "back",
        },
      ],
    },
  ]);
}
