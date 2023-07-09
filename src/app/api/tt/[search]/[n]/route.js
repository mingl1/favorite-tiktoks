// import axios from "axios";
import { NextResponse } from "next/server";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
/**
 * @param {any} _request
 * @param {{ params: { search: string, n:number } }} param1
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
  const response = await client.send(command);
  const x = Uint8Array.from(response.Body);
  const string = new TextDecoder().decode(x);
  const b = JSON.parse(string);
  return NextResponse.json(JSON.parse(b));
  // } catch (err) {
  //   return new NextResponse(err);
  // }
}
