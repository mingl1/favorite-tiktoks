// import axios from "axios";
import { NextResponse } from "next/server";

/**
 * @param {any} _request
 * @param {{ params: { search: string, n:number } }} param1
 */
export async function GET(_request, { params }) {
  const { search, n } = params;

  const req = await fetch(
    `https://flask-service.ndlnug1ausitc.us-east-1.cs.amazonlightsail.com/search?search=${search}&n=${n}`
  );
  // try {
  const response = await req.json();
  return NextResponse.json(response);
  // } catch (err) {
  //   return new NextResponse(err);
  // }
}
