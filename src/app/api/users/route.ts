import { auth } from "@/auth";
import db from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log(body.id);
    if (session.user.id != body.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const newEvent = await db
      .update(users)
      .set({
        name: body.name,
      })
      .where(eq(users.id, body.id))
      .returning();

    return Response.json(newEvent[0]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
