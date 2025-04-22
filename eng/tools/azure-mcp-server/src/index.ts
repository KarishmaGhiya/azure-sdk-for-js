import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getMergeConflictsCli } from "./commands/getMergeConflictsCli";
import { resolveMergeConflicts } from "./commands/resolveMergeConflicts"; // Add this import
import { exec } from "child_process";
import { promisify } from "util";
import { resolveMergeConflictsByFileType } from "./commands/resolveMergeConflictsByFileType";

const execAsync = promisify(exec);

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
    try {
      // Set up GitHub token for CLI
      process.env.GITHUB_TOKEN = token;

      // Check if PR is mergeable using GitHub CLI
      const { stdout: prInfo } = await execAsync(
        `gh pr view ${pull_number} --repo ${owner}/${repo} --json mergeable,mergeStateStatus`
      );
      
      const data = JSON.parse(prInfo);

      let result;
      if (data.mergeable === false) {
        // Use the CLI-based implementation to get merge conflicts
        const conflicts = await getMergeConflictsCli(owner, repo, pull_number, token);
        result = {
          mergeable: data.mergeable,
          hasConflicts: true,
          conflicts,
        };
      } else if (data.mergeable === null || data.mergeable === undefined) {
        result = {
          mergeable: "unknown",
          hasConflicts: false,
          message: "GitHub is still calculating merge status. Please try again in a few moments."
        };
      } else {
        result = {
          mergeable: data.mergeable,
          hasConflicts: data.mergeStateStatus === "DIRTY",
        };
      }

      return {       
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching pull request data:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch pull request data. Please check the provided details. ${error}`
          }
        ],
        isError: true
      };
    }
  }
);

// Add the new tool for resolving merge conflicts
server.tool(
  "resolve_merge_conflicts",
  "resolves merge conflicts in a pull request using a specified strategy",
  {
    owner: z.string(),
    repo: z.string(),
    pull_number: z.number(),
    token: z.string(),
  },
  async ({ owner, repo, pull_number, token }) => {
    try {
      // Call the resolve merge conflicts function
      const result = await resolveMergeConflictsByFileType(
        owner,
        repo,
        pull_number,
        token,
      );
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error("Error resolving merge conflicts:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to resolve merge conflicts. Please check the provided details. ${error}`
          }
        ],
        isError: true
      };
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
