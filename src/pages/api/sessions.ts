import type { ISessionData } from "@/stores/sessionStore";
import type { APIRoute } from "astro";
import { Session, SessionEvent, db, eq } from "astro:db";
import type { TSessionWithEvents } from "../../sessions";

const isBodyValid = (body: ISessionData[] | undefined) => {
  if (!body) {
    console.error("no body");
    return false;
  }

  // try to json parse the body
  try {
    JSON.parse(JSON.stringify(body));
  } catch (e) {
    console.error("invalid json");
    return false;
  }

  // make sure body is an array and length is greater than 0
  if (!Array.isArray(body) || body.length === 0) {
    console.error("invalid array");
    return false;
  }

  return true;
};

function calculateSessionDuration(
  startDate: string | Date,
  events: ISessionData[],
): { hours: number; minutes: number; seconds: number; milliseconds: number } {
  // Ensure the startDate is a Date object
  const sessionStart: Date = new Date(startDate);

  // Initialize the last submission timestamp to the start date initially
  let lastSubmission: Date = sessionStart;

  // Loop through all events to find the latest submission timestamp
  events.forEach((event) => {
    const submissionTime: Date = new Date(event.submission_timestamp);
    if (submissionTime > lastSubmission) {
      lastSubmission = submissionTime;
    }
  });

  // Calculate the duration in milliseconds
  const duration: number = lastSubmission.getTime() - sessionStart.getTime();

  // Convert the duration from milliseconds to a more readable format (e.g., hours, minutes, seconds)
  const seconds: number = Math.floor((duration / 1000) % 60);
  const minutes: number = Math.floor((duration / (1000 * 60)) % 60);
  const hours: number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: duration,
  };
}

// called at the end of the session to add all the collected data to the database
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(
      JSON.stringify({
        message: "Invalid Content-Type header",
      }),
      {
        status: 405,
      },
    );
  }

  const body: ISessionData[] | undefined = await request.json();

  // not body only to satisfy the type checker
  if (!body || !isBodyValid(body)) {
    return new Response(
      JSON.stringify({
        message: "Invalid body sent",
      }),
      {
        status: 400,
      },
    );
  }

  // these are basically the session information
  // these are consistent for events in a session, so we can just take the first one
  const {
    session,
    device,
    starting_timestamp: time_started,
    isEyeTracked,
    browserInfo,
  } = body[0];

  // regex to get only the numbers from the session name, "1" from "session 1"
  const sessionNumber = session?.match(/\d+/g);
  const deviceNumber = device?.match(/\d+/g);

  // run server code here to upload the session
  // create the session
  // find the duration of the session
  let session_duration = calculateSessionDuration(
    time_started,
    body,
  ).milliseconds;

  const newSessionId = await db
    .insert(Session)
    .values({
      device_identifier: `${sessionNumber}.${deviceNumber}`,
      timeStarted: new Date(time_started),
      session_duration,
      isEyeTracked,
      browserInfo,
    })
    .returning({ id: Session.id });

  console.log(newSessionId);

  // create the session events
  // ignores because batch insert doesn't have types
  // see more: https://orm.drizzle.team/docs/batch-api
  // @ts-ignore
  const queries = [];
  body.map((event) => {
    queries.push(
      db.insert(SessionEvent).values({
        card_idx: event.cardIdx,
        card_title: event.cardTitle,
        chosen_answer: event.chosenAnswer,
        flips: event.flips,
        num_flips: event.flips.length,
        session_id: newSessionId[0].id,
        starting_timestamp: new Date(event.starting_timestamp),
        submission_timestamp: new Date(event.submission_timestamp),
        time_spent_back: event.time_spent_back,
        time_spent_front: event.time_spent_front,
        page_url: event.page_url,
        mouse_pos: event.mouse_pos,
      }),
    );
  });

  // @ts-ignore
  await db.batch(queries);

  return new Response(
    JSON.stringify({
      message: body,
    }),
  );
};

// called when the user wants to get all the sessions
export const GET: APIRoute = async ({ request }) => {
  const sessions = await db.select().from(Session);

  let newSessions: TSessionWithEvents[] = sessions.map((session) => {
    return {
      ...session,
      events: [],
    };
  });
  let data = [];

  for (let i = 0; i < newSessions.length; i++) {
    const session = newSessions[i];
    const session_id = session.id;

    // get all the associated SessionEvents of this event
    const sessionEvents = await db
      .select()
      .from(SessionEvent)
      .where(eq(SessionEvent.session_id, session_id));

    // add the session events to the session object
    session.events = sessionEvents;

    data.push({
      ...session,
    });
  }

  return new Response(
    JSON.stringify({
      data,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=sessions.json",
      },
    },
  );
};

export const ALL: APIRoute = ({}) => {
  return new Response(
    JSON.stringify({
      message: "This method is not allowed.",
    }),
    {
      status: 405,
    },
  );
};
