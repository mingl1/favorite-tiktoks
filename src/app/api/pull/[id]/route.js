import { getExecution } from "@defer/client";
/**
 * @param {any} _request
 * @param {{ params: { id: string } }} param1
 * @returns {Promise<Response>}
 */
export async function GET(_request, { params }) {
  const { id } = params;
  const execution = await getExecution(id);
  return NextResponse.json(execution);
}
