import { defer } from "@defer/client";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
  // type InvokeEndpointAsyncCommandOutput,
} from "@aws-sdk/client-sagemaker-runtime";
// import { NextResponse } from "next/server";
/**
 * @param {string} search
 * @param {number} n
 */
async function find(search, n) {
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
  };
  const command = new InvokeEndpointCommand(input);
  const response = await client.send(command).then((res) => {
    console.log("found result");
    const x = Uint8Array.from(res.Body);
    var string = new TextDecoder().decode(x);
    const b = JSON.parse(string);
    const v = JSON.parse(b);
    return v;
  });
  return response;
}

export default defer(find);
