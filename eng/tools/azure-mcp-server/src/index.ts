import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Octokit } from "@octokit/rest";

// Create an MCP server
const server = new McpServer({
  name: "Azure SDK Support",
  version: "1.0.0",
});

server.tool(
  "get_merge_conflicts",
  "checks if a pull request has merge conflicts",
  {
    owner: z.string(),
    repo: z.string(),
    pull_number: z.number(),
    token: z.string(),
  },
  async ({ owner, repo, pull_number, token }) => {
    const octokit = new Octokit({ auth: token });

    try {
      const { data } = await octokit.pulls.get({
        owner,
        repo,
        pull_number,
      });

      return {
        mergeable: data.mergeable,
        hasConflicts: data.mergeable_state === "dirty",
      };
    } catch (error) {
      console.error("Error fetching pull request data:", error);
      throw new Error("Failed to fetch pull request merge status");
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Azure MCP server started");
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
