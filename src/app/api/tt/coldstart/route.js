import { NextResponse } from "next/server";
import coldStart from "../../../../defer/coldStart";

export async function GET(_request) {
  await coldStart();
  return NextResponse.json({ coldStart: "done" });
}
