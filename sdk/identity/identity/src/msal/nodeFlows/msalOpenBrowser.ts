// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MsalNode, MsalNodeOptions } from "./msalNodeCommon";
import { credentialLogger } from "../../util/logging";
import { AccessToken } from "@azure/core-auth";
import { CredentialFlowGetTokenOptions } from "../credentials";
import open from "open";

/**
 * Options that can be passed to configure MSAL to handle authentication through opening a browser window.
 * @internal
 */
export interface MsalOpenBrowserOptions extends MsalNodeOptions {
  redirectUri: string;
  loginHint?: string;
}

/**
 * A call to open(), but mockable
 * @internal
 */
export const interactiveBrowserMockable = {
  open,
};

/**
 * This MSAL client sets up a web server to listen for redirect callbacks, then calls to the MSAL's public application's `acquireTokenByDeviceCode` during `doGetToken`
 * to trigger the authentication flow, and then respond based on the values obtained from the redirect callback
 * @internal
 */
export class MsalOpenBrowser extends MsalNode {
  private loginHint?: string;

  constructor(options: MsalOpenBrowserOptions) {
    super(options);
    this.loginHint = options.loginHint;
    this.logger = credentialLogger("Node.js MSAL Open Browser");
  }

  protected async doGetToken(
    scopes: string[],
    options?: CredentialFlowGetTokenOptions
  ): Promise<AccessToken> {
    const response = await this.getApp("public", options?.enableCae).acquireTokenInteractive({
      openBrowser: async (url) => {
        await interactiveBrowserMockable.open(url, { wait: true, newInstance: true });
      },
      scopes,
      authority: options?.authority,
      claims: options?.claims,
      correlationId: options?.correlationId,
      loginHint: this.loginHint,
    });

    const expiresOnTimestamp = response?.expiresOn?.valueOf();
    if (!expiresOnTimestamp) {
      throw new Error(`Interactive Browser Authentication Error "Did not receive token with a valid expiration"`);
    }

    return {
      expiresOnTimestamp: expiresOnTimestamp,
      token: response.accessToken,
    };
  }
}
