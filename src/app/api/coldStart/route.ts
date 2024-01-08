// import { NextResponse } from "next/server";
import coldStart from "../../defer/coldStart";
// import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: Request) {
  await coldStart();

  return Response.json({ ok: true });
}
export const dynamic = "force-dynamic";
