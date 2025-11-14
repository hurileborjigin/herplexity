import axios from "axios";

export async function POST(req) {
  const { runID } = await req.json();
  if (!runID) {
    return Response.json({ error: "runID is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runID}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNIN_KEY}`,
        },
      }
    );

    return Response.json(response.data);
  } catch (error) {
    console.error("Failed to fetch Inngest run status", error);
    return Response.json(
      { error: "Failed to fetch Inngest run status" },
      { status: 500 }
    );
  }
}
