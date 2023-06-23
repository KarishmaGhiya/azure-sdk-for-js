// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzurePluginContext, NativeBrokerPluginOptions } from "../../identity/src/plugins/provider";
import { IdentityPlugin } from "@azure/identity";
import { NativeBrokerPlugin } from "@azure/msal-node-extensions";

/**
 * A plugin that provides WAM Integration for `@azure/identity`
 * credentials. The plugin API is compatible with `@azure/identity` versions
 * 2.0.0 and later. Load this plugin using the `useIdentityPlugin`
 * function, imported from `@azure/identity`.
 *
 * Example:
 *
 * ```javascript
 * import { useIdentityPlugin, DeviceCodeCredential } from "@azure/identity";
 * import { nativeBrokerPlugin } from "@azure/identity-cache-persistence";
 *
 * // Load the plugin
 * useIdentityPlugin(nativeBrokerPlugin);
 *
 * const credential = new DeviceCodeCredential({
 *   enableMsaPassthrough: true
 * });
 * ```
 */

export function createNativeBrokerPlugin(options: NativeBrokerPluginOptions): IdentityPlugin {
  return async function nativeBrokerPlugin({ nativeBrokerPluginControl }: AzurePluginContext) {
    nativeBrokerPluginControl.setNativeBroker(new NativeBrokerPlugin(), options)
  } as IdentityPlugin;
}

// export const nativeBrokerPlugin: IdentityPlugin = (context) => {
//   const { nativeBrokerPluginControl } = context as AzurePluginContext;
  
//   nativeBrokerPluginControl.setNativeBroker(async () => new NativeBrokerPlugin());
//   nativeBrokerPluginControl.createNativeBrokerPlugin(async(options?: NativeBrokerPluginOptions) => {
    
//     return new NativeBrokerPlugin()
//   }
//   );
// };
