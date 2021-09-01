// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Pipeline, PipelinePolicy } from "@azure/core-rest-pipeline";
import { createClientPipeline, ServiceClientOptions } from "@azure/core-client";
export class LogSenderClient {
  private _workspaceId: string;
  private _ingestEndpointSuffix: string;
  private _pipeline: Pipeline;

  constructor(
    workspaceId: string,
    ingestEndpointSuffix: string,
    sharedKey: string,
    options?: ServiceClientOptions
  ) {
    this._workspaceId = workspaceId;
    this._ingestEndpointSuffix = ingestEndpointSuffix;
    let policy: PipelinePolicy = {
      name: "Signature"
    };
    this._pipeline = createClientPipeline(options).addPolicy(); // HttpPipelineBuilder.Build(options, new SignaturePolicy(workspaceId, sharedKey));
  }
}
