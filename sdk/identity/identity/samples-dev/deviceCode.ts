// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Authenticates with an app registration’s client Id and secret.
 */

import { DeviceCodeCredential } from "@azure/identity";
import { useIdentityPlugin } from "@azure/identity";
import { cachePersistencePlugin } from "@azure/identity-cache-persistence";

useIdentityPlugin(cachePersistencePlugin);
// Load the .env file if it exists
require("dotenv").config();


export async function main(): Promise<void> {
  const credential = new DeviceCodeCredential({
    tenantId: "72f988bf-86f1-41af-91ab-2d7cd011db47", // The tenant ID in Azure Active Directory
    clientId: "38c02a1e-d3be-4ec1-98a5-cb52a9d2b903", // The app registration client Id in the AAD tenant
    tokenCachePersistenceOptions: {
        enabled: true,
      unsafeAllowUnencryptedStorage: true
    },
  }
  );
 await credential.getToken("https://vault.azure.net/.default");
  const authenticationRecord = await credential.authenticate(["https://vault.azure.net/.default"])
  console.log(authenticationRecord)
}

main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
});
