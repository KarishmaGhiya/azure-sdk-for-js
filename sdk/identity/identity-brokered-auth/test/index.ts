// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useIdentityPlugin } from "@azure/identity";
import { createNativeBrokerPlugin } from "../src";

// Load the plugin
useIdentityPlugin(createNativeBrokerPlugin({
    enableMSAPassthrough: true,
    parentWindowHandle: Buffer.from("dasdasd","utf-8")
  }));
