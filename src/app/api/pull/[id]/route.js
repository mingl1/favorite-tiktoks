import { getExecution } from "@defer/client";
import { NextResponse } from "next/server";
/**
 * @param {any} _request
 * @param {{ params: { id: string } }} param1
 * @returns {Promise<NextResponse>}
 */
export async function GET(_request, { params }) {
  const { id } = params;
  const execution = await getExecution(id);
  return NextResponse.json(execution);
}
