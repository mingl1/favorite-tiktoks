import { defer } from "@defer/client";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
  // type InvokeEndpointAsyncCommandOutput,
} from "@aws-sdk/client-sagemaker-runtime";
// import { NextResponse } from "next/server";

async function longRunning(): Promise<string> {
  const client = new SageMakerRuntimeClient({ region: "us-east-1" });
  const a = {
    inputs: "coldStart",
    n: 1,
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
  return await client.send(command).then((_) => {
    console.log("found result");

    return "done";
  });
}

export default defer(longRunning);
