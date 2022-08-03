// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AccessToken, } from "@azure/core-auth";
import { MsalNode, MsalNodeOptions } from "../msalNodeCommon";
import { CredentialFlowGetTokenOptions } from "../../credentials";

/**
 * Options to send on the {@link ManagedIdentityCredential} constructor.
 * This variation supports `clientId` and not `resourceId`, since only one of both is supported.
 */
export interface MSALManagedIdentityCredentialClientIdOptions extends MsalNodeOptions {
  /**
   * The client ID of the user - assigned identity, or app registration(when working with AKS pod - identity).
   */
  clientId?: string;
}

/**
 * Options to send on the {@link ManagedIdentityCredential} constructor.
 * This variation supports `resourceId` and not `clientId`, since only one of both is supported.
 */
export interface MSALManagedIdentityCredentialResourceIdOptions extends MsalNodeOptions {
  /**
   * Allows specifying a custom resource Id.
   * In scenarios such as when user assigned identities are created using an ARM template,
   * where the resource Id of the identity is known but the client Id can't be known ahead of time,
   * this parameter allows programs to use these user assigned identities
   * without having to first determine the client Id of the created identity.
   */
  resourceId: string;
}

export interface MSALManagedIdentityOptions extends MsalNodeOptions {

}
/**
 * MSAL client secret client. Calls to MSAL's confidential application's `acquireTokenByClientCredential` during `doGetToken`.
 * @internal
 */
 export class MsalClientManagedIdentity extends MsalNode {
     /**
   * Creates an instance of ManagedIdentityCredential with the client ID of a
   * user-assigned identity, or app registration (when working with AKS pod-identity).
   *
   * @param clientId - The client ID of the user-assigned identity, or app registration (when working with AKS pod-identity).
   * @param options - Options for configuring the client which makes the access token request.
   */
  constructor(clientId: string, options?: MsalNodeOptions);
  /**
   * Creates an instance of ManagedIdentityCredential with clientId
   *
   * @param options - Options for configuring the client which makes the access token request.
   */
  constructor(options?: MSALManagedIdentityCredentialClientIdOptions);
  /**
   * Creates an instance of ManagedIdentityCredential with Resource Id
   *
   * @param options - Options for configuring the resource which makes the access token request.
   */
  constructor(options?: MSALManagedIdentityCredentialResourceIdOptions);
  /**
   * @internal
   * @hidden
   */
  constructor(
    options?:
      | string
      | MSALManagedIdentityCredentialClientIdOptions
      | MSALManagedIdentityCredentialResourceIdOptions
      | MsalNodeOptions
  ){
      super(options as MsalNodeOptions);
      this.requiresConfidential = true;
      //this.identityClient
      //this.clientId


  }
  
    protected async doGetToken(
      scopes: string[],
      options: CredentialFlowGetTokenOptions = {}
    ): Promise<AccessToken> {
      try {
        const result = await this.confidentialApp!.acquireTokenByClientCredential({
          scopes,
          correlationId: options.correlationId,
          azureRegion: this.azureRegion,
          authority: options.authority,
          claims: options.claims,
        });
        // The Client Credential flow does not return an account,
        // so each time getToken gets called, we will have to acquire a new token through the service.
        return this.handleResult(scopes, this.clientId, result || undefined);
      } catch (err: any) {
        throw this.handleError(scopes, err, options);
      }
    }
  }