import { NextResponse } from "next/server";
import coldStart from "../../../defer/coldStart";

/**
 * @param {any} _request
 * @returns {Promise<NextResponse>}
 */
export async function GET(_request) {
  await coldStart();
  return NextResponse.json({ coldStart: "done" });
}
