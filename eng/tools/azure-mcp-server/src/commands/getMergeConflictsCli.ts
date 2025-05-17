import { Octokit } from "@octokit/rest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface MergeConflict {
  file: string;
  conflictDetails: string;
}

export async function getMergeConflicts(
  owner: string,
  repo: string,
  pullNumber: number,
  token: string,
  octokitInstance?: Octokit
): Promise<MergeConflict[]> {
  const octokit = octokitInstance || new Octokit({ auth: token });

  try {
    const response = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (response.data.mergeable === false) {
      const diffResponse = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
        mediaType: {
          format: "diff",
        },
      });

      const conflicts = parseMergeConflicts(diffResponse.data as unknown as string);
      return conflicts;
    } else {
      console.log("No merge conflicts detected.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching merge conflicts:", error);
    throw error;
  }
}

/**
 * Get merge conflicts for a pull request using GitHub CLI
 */
export async function getMergeConflictsCli(
  owner: string,
  repo: string,
  pullNumber: number,
  token: string
): Promise<MergeConflict[]> {
  try {
    // Set GitHub token for CLI authentication
    process.env.GITHUB_TOKEN = token;

    // Check if PR is mergeable
    const { stdout: prInfo } = await execAsync(
      `gh pr view ${pullNumber} --repo ${owner}/${repo} --json mergeable,mergeStateStatus`
    );

    const prData = JSON.parse(prInfo);

    if (prData.mergeable === "CONFLICTING") {
      console.log(`Fetching diff for PR #${pullNumber}...`);
      // Get the diff to analyze conflicts
      const { stdout: diffOutput } = await execAsync(
        `gh pr diff ${pullNumber} --repo ${owner}/${repo}`
      );

      const conflicts = parseMergeConflicts(diffOutput);
      return conflicts;
    } else {
      console.log("No merge conflicts detected.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching merge conflicts:", error);
    throw error;
  }
}

function parseMergeConflicts(diff: string): MergeConflict[] {
  const conflicts: MergeConflict[] = [];
  const fileHeaderRegex = /^diff --git a\/(.+?) b\/(.+?)$/gm;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  match = fileHeaderRegex.exec(diff)
  console.log("match", match);
  while ((match = fileHeaderRegex.exec(diff)) !== null) {
    const file = match[2];
    console.log("file", file);
    const start = match.index;
    const end = fileHeaderRegex.lastIndex;
    // Get the diff chunk for this file
    const nextMatch = fileHeaderRegex.exec(diff);
    const chunk = diff.substring(start, nextMatch ? nextMatch.index : diff.length);
    fileHeaderRegex.lastIndex = end; // Reset for next iteration

    // Check for conflict markers
    if (/^<<<<<<< |^=======|^>>>>>>>/m.test(chunk)) {
      conflicts.push({
        file,
        conflictDetails: "Conflict markers found in this file.",
      });
      console.log("Conflict found in file:", file);
      console.log("Conflict details:", chunk);
    }
  }
  if (conflicts.length === 0) {
    console.log("No merge conflicts found in the diff.");
  } else {
    console.log(`Found ${conflicts.length} merge conflicts.`);
  }
  return conflicts;
}
