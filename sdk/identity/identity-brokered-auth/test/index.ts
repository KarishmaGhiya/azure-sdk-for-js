// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useIdentityPlugin } from "@azure/identity";
import { nativeBrokerPlugin } from "../src";

// Load the plugin
useIdentityPlugin(nativeBrokerPlugin);
