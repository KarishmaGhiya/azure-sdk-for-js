// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AuthenticationRecord,
  AuthenticationRequiredError,
  // ClientCertificateCredential,
  // ClientSecretCredential,
  DefaultAzureCredential,
  deserializeAuthenticationRecord,
  InteractiveBrowserCredential,
  InteractiveBrowserCredentialOptions,
  serializeAuthenticationRecord
} from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { CertificateClient } from "@azure/keyvault-certificates";
import fs from "fs";
import { promisify } from "util";
// Load the .env file if it exists
require("dotenv").config();

export async function main(): Promise<void> {
  const credential = new DefaultAzureCredential();

  const keyVaultUrl = `https://key-vault-name.vault.azure.net`;
  const certificateClient = new CertificateClient(keyVaultUrl, credential);
  const options: InteractiveBrowserCredentialOptions = {
    tokenCachePersistenceOptions: {
      enabled: true
    }
  };
  const userInteractionCred = new InteractiveBrowserCredential(options);
  await userInteractionCred.authenticate("https://vault.azure.net/.default");
  const secretClient = new SecretClient(keyVaultUrl, credential);
  const authRecord: AuthenticationRecord = {
    authority: "dsfds",
    homeAccountId: "dasfda",
    clientId: "ddasd",
    tenantId: "dasfa",
    username: "sdasd"
  };
  const AUTH_RECORD_PATH = "./tokencache.bin";
  const writeFileAsync = promisify(fs.writeFile);
  const content = serializeAuthenticationRecord(authRecord);
  await writeFileAsync(AUTH_RECORD_PATH, content);

  const readFileAsync = promisify(fs.readFile);
  const fileContent = await readFileAsync(AUTH_RECORD_PATH, { encoding: "utf-8" });
  const deContent: AuthenticationRecord = deserializeAuthenticationRecord(fileContent);
  const options2: InteractiveBrowserCredentialOptions = {
    tokenCachePersistenceOptions: {
      enabled: true
    },
    authenticationRecord: deContent
  };
  const authCred = new InteractiveBrowserCredential(options2);
  pkcs12Cert(certificateClient);
  // new ClientCertificateCredential(
  //     process.env.AZURE_TENANT_ID!, // The tenant ID in Azure Active Directory
  //     process.env.AZURE_CLIENT_ID!, // The application (client) ID registered in the AAD tenant
  //     process.env.AZURE_CERT_PATH! // The client secret for the registered application
  //   );

  //const client = new KeyClient(keyVaultUrl, credential);

  // Retrieving the properties of the existing keys in that specific Key Vault.
  //console.log(await client.listPropertiesOfKeys().next());
}

/**
 *
 * Demonstrates creating a CertificateCredential with a Key Vault certificate stored in PKCS12 (default) format
 */
async function pkcs12Cert(certificateClient: CertificateClient) {
  // Creating a self-signed cert to work with
  const certificatePolicy = {
    issuerName: "Self",
    subject: "cn=MyCert"
  };
  //  "azure-identity-sample-default", CertificatePolicy.get_default()
  const createCertPoller = certificateClient.beginCreateCertificate(
    "azure-identity-sample-default",
    certificatePolicy
  );
  const cert = (await createCertPoller).getResult();

  //"azure-identity-sample-default"
  const policy = certificateClient.getCertificatePolicy(cert.name);
}
main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
});
