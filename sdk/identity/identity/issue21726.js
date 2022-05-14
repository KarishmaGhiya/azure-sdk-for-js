const identity = require("./dist");
async function main(){
    const browserCredential = new identity.InteractiveBrowserCredential({
        redirectUri: `http://localhost:31337`
      });
      const result = await browserCredential.getToken("https://vault.azure.net/.default");
      console.log("login success");
      console.log(result.token);
}

main().catch((err)=>{
console.error(err);
process.exit(1);
});
