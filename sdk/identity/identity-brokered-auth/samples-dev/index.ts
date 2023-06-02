// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { InteractiveBrowserCredential, useIdentityPlugin } from "@azure/identity";
import { nativeBrokerPlugin } from "@azure/identity-brokered-auth";
import dotenv from "dotenv";

// Load the plugin
useIdentityPlugin(nativeBrokerPlugin);

// Load the environment
dotenv.config();

async function main() {
  const credential = new InteractiveBrowserCredential({
    enableMsaPassthrough: true,
  });

  // This is the scope we will use to get a token from the AAD token endpoint.
  // By default, we'll use the Microsoft Graph scope as an example, but when
  // you use the credential with an Azure SDK package, it will configure the
  // scope for you automatically.
  const scope = process.env.AAD_TEST_SCOPE ?? "https://graph.microsoft.com/.default";

  const token = await credential.getToken(scope);

  console.log(`Token: ${token}`);
}

main().catch((error) => {
  console.error("The sample encountered an error:", error);
  process.exit(1);
});
