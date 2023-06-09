// import axios from "axios";
import { NextResponse } from "next/server";

/**
 * @param {any} _request
 * @param {{ params: { search: string } }} param1
 */
export async function GET(_request, { params }) {
  const { search } = params;

  const req = await fetch(
    `https://flask-service.ndlnug1ausitc.us-east-1.cs.amazonlightsail.com/search?search=${search}`
  );
  // try {
  const response = await req.json();
  return NextResponse.json(response);
  // } catch (err) {
  //   return new NextResponse(err);
  // }
}
