import type { ISessionData } from "@/stores/sessionStore";
import type { APIRoute } from "astro";
import { db, Session, SessionEvent } from "astro:db";

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

  console.log(body);

  // make sure body is an array and length is greater than 0
  if (!Array.isArray(body) || body.length === 0) {
    console.error("invalid array");
    return false;
  }

  return true;
};

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
    submission_timestamp: time_started,
    isEyeTracked,
  } = body[0];

  // regex to get only the numbers from the session name, "1" from "session 1"
  const sessionNumber = session?.match(/\d+/g);
  const deviceNumber = device?.match(/\d+/g);

  // run server code here to upload the session
  // create the session
  const newSessionId = await db
    .insert(Session)
    .values({
      device_identifier: `${sessionNumber}.${deviceNumber}`,
      timeStarted: new Date(time_started),
      isEyeTracked,
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
        session_id: newSessionId[0].id,
        submission_timestamp: new Date(event.submission_timestamp),
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

  return new Response(
    JSON.stringify({
      message: "This was a POST!",
    }),
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
