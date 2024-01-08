import { defer } from "@defer/client";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
  // type InvokeEndpointAsyncCommandOutput,
} from "@aws-sdk/client-sagemaker-runtime";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

async function longRunning(): Promise<NextResponse> {
  const client = new SageMakerRuntimeClient({ region: "us-east-1" });
  const a = {
    inputs: "coldStart",
    n: 3,
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
  return await client.send(command).then((res) => {
    const x = Uint8Array.from(res.Body);
    var string = new TextDecoder().decode(x);
    const b = JSON.parse(string);
    const v = JSON.parse(b);
    console.log(v);
    return NextResponse.json(v);
  });
}

export default defer(longRunning);
