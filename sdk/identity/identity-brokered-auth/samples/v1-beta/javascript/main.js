// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Demonstrates usage of @azure/identity-brokered-auth and @azure/identity
 * packages for WAM MSA support.
 */

const { InteractiveBrowserCredential, useIdentityPlugin } = require("@azure/identity");
const { createNativeBrokerPlugin } = require("@azure/identity-brokered-auth");
const dotenv = require("dotenv");
const { app, BrowserWindow} = require("electron");



// Load the environment
dotenv.config();

  // Load the plugin
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true
    }
  })
  win.loadFile('index.html')
  return win.getNativeWindowHandle()
}

console.dir(`electron app not found?? = ${app}`);
  app.on('ready', async() => {
  let winHandle = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      winHandle = createWindow()
    }
  })
  if(winHandle){
    useIdentityPlugin(
      createNativeBrokerPlugin({
        enableMSAPassthrough: true,
        parentWindowHandle: winHandle,
      })
    );
  }
  try{
    //with broker
    const credential = new InteractiveBrowserCredential({
      clientId: process.env.AZURE_CLIENT_ID || "client",
      authorityHost: process.env.AZURE_AUTHORITY_HOST,
      tenantId: process.env.AZURE_TENANT_ID,
      useBroker: true
    });
    //without broker
    const cred2 = new InteractiveBrowserCredential({
      clientId: process.env.AZURE_CLIENT_ID || "client",
      authorityHost: process.env.AZURE_AUTHORITY_HOST,
      tenantId: process.env.AZURE_TENANT_ID,
    });
    // This is the scope we will use to get a token from the AAD token endpoint.
    // By default, we'll use the Microsoft Graph scope as an example, but when
    // you use the credential with an Azure SDK package, it will configure the
    // scope for you automatically.
    const scope = process.env.AAD_TEST_SCOPE ?? "https://graph.microsoft.com/.default";
  
    const token = await credential.getToken(scope);
  
    console.log(`Token: ${token.token}: ${token.expiresOnTimestamp}`);
    const token2 = await cred2.getToken(scope);
  
    console.log(`Token: ${token2.token}: ${token2.expiresOnTimestamp}`);
  }
  catch(e){
    console.log(e);
  }

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
