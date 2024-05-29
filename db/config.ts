import { column, defineDb, defineTable } from "astro:db";

const Session = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    device_identifier: column.text(),
    timeStarted: column.date(),
    isEyeTracked: column.boolean(),
    // in ms
    session_duration: column.number(),
    browserInfo: column.json(),
  },
});

const SessionEvent = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    session_id: column.number({ references: () => Session.columns.id }),
    card_title: column.text(),
    chosen_answer: column.text(),
    flips: column.json(),
    num_flips: column.number(),
    starting_timestamp: column.date(),
    submission_timestamp: column.date(),
    card_idx: column.number(),
    time_spent_front: column.number(),
    time_spent_back: column.number(),
    page_url: column.text(),
    mouse_pos: column.json(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Session,
    SessionEvent,
  },
});
