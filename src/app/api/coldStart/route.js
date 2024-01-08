import { NextResponse } from "next/server";
// import coldStart from "../../defer/coldStart";
// import dynamic from "next/dynamic";

/**
 * @param {any} _request
 * @returns {Promise<NextResponse>}
 */
export async function GET(_request) {
  // await coldStart();
  return NextResponse.json({ coldStart: "done" });
}
// export const dynamic = "force-dynamic";
