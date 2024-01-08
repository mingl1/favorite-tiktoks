// import axios from "axios";
import { NextResponse } from "next/server";
// import { getExecution } from "@defer/client";
// import {
//   SageMakerRuntimeClient,
//   InvokeEndpointCommand,
// } from "@aws-sdk/client-sagemaker-runtime";
import find from "../../../../defer/search.js";
/**
 * @param {any} _request
 * @param {{ params: { search: string, n:number } }} param1
 * @returns {Promise<NextResponse>}
 */

export async function GET(_request, { params }) {
  const { search, n } = params;
  const id = await find(search, n).then((res) => res.id);

  return NextResponse.json(id);
  // const client = new SageMakerRuntimeClient({ region: "us-east-1" });
  // let a = {
  //   inputs: search,
  //   n: n,
  // };
  // const input = {
  //   // InvokeEndpointInput
  //   EndpointName: "huggingface-pytorch-inference-2023-07-09-02-42-34-486", // required
  //   Body: JSON.stringify(a), // required
  //   ContentType: "application/json", // required
  // };
  // const command = new InvokeEndpointCommand(input);
  // const response = await client.send(command).then((res) => {
  //   console.log("found result");
  //   const x = Uint8Array.from(res.Body);
  //   var string = new TextDecoder().decode(x);
  //   const b = JSON.parse(string);
  //   const v = JSON.parse(b);
  //   return NextResponse.json(v);
  // });
  // return response;

  // while (string.startsWith
  // try {

  // }
  // catch (error){
  //   const response2 = await client.send(command);
  //   const x2 = Uint8Array.from(response.Body);
  //   const string2 = new TextDecoder().decode(x2);
  //   const b2 = JSON.parse(string2);
  //   return NextResponse.json(JSON.parse(b2));
  // }

  // } catch (err) {
  //   return new NextResponse(err);
  // }
}
export const dynamic = "force-dynamic";
