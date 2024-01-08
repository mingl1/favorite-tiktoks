// import { NextResponse } from "next/server";
import coldStart from "../../defer/coldStart";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  ok: boolean;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await coldStart();
  res.status(200).json({ ok: true });
}
export const dynamic = "force-dynamic";
