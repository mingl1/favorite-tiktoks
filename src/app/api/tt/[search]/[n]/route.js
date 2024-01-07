// import axios from "axios";
import { NextResponse } from "next/server";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

/**
 * @param {any} _request
 * @param {{ params: { search: string, n:number } }} param1
 * @returns {Promise<NextResponse>}
 */

export async function GET(_request, { params }) {
  const { search, n } = params;
  const client = new SageMakerRuntimeClient({ region: "us-east-1" });
  let a = {
    inputs: search,
    n: n,
  };
  const input = {
    // InvokeEndpointInput
    EndpointName: "huggingface-pytorch-inference-2023-07-09-02-42-34-486", // required
    Body: JSON.stringify(a), // required
    ContentType: "application/json", // required
    // Accept: "STRING_VALUE",
    // CustomAttributes: "STRING_VALUE",
    // TargetModel: "STRING_VALUE",
    // TargetVariant: "STRING_VALUE",
    // TargetContainerHostname: "STRING_VALUE",
    // InferenceId: "STRING_VALUE",
    // EnableExplanations: "STRING_VALUE",
  };
  const command = new InvokeEndpointCommand(input);
  const response = await client.send(command).then((res) => {
    console.log("found result");
    const x = Uint8Array.from(res.Body);
    var string = new TextDecoder().decode(x);
    const b = JSON.parse(string);
    const v = JSON.parse(b);
    return NextResponse.json(v);
  });
  // .catch(async (err) => {
  //   console.log("did not find result");
  //   console.log(err);
  //   // const x = Uint8Array.from(err.Body);
  //   if (Number(n) > 0) return await GET(_request, { params });
  //   else return NextResponse.json({ error: "please try again" });
  // });

  return response;

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
