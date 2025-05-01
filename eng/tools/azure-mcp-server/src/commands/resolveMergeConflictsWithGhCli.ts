import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// Log the directory MCP tool operates in
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gh-resolve-conflicts-"));
console.log(`MCP tool operating in temporary directory: ${tempDir}`);

// Change the working directory to the temporary directory
process.chdir(tempDir);

/**
 * Resolves merge conflicts in a GitHub pull request based on file types using GitHub CLI.
 * Specifically handles conflicts in `pnpm-lock.yaml` by following a structured resolution process.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param pullNumber - Pull request number.
 * @returns A promise that resolves to a status message.
 */
export async function resolveMergeConflictsWithGhCli(
  owner: string,
  repo: string,
  pullNumber: number,
  token: string
): Promise<string> {
  try {
    process.env.GH_TOKEN = token;
    // Fetch PR details using GitHub CLI
    const prDetails = JSON.parse(
      execSync(`gh pr view ${pullNumber} --repo ${owner}/${repo} --json mergeStateStatus,headRefName,baseRefName`).toString()
    );

    if (prDetails.mergeStateStatus !== "CONFLICTING" && prDetails.mergeStateStatus !== "DIRTY") {
      return `No conflicts to resolve. Mergeable state: ${prDetails.mergeStateStatus}`;
    }


    // Fetch conflicting files using GitHub CLI
    const prFiles = JSON.parse(
      execSync(`gh pr view ${pullNumber} --repo ${owner}/${repo} --json files`).toString()
    );

    for (const file of prFiles.files) {
      if (file.path === "pnpm-lock.yaml") {
        resolvePnpmLockConflict(prDetails.headRefName, prDetails.baseRefName);
        break;
      } else if (file.status === "modified") {
        const fileType = path.extname(file.path);

        // Apply resolution logic based on file type
        let resolvedContent: string | null = null;
        if (fileType === ".json") {
          resolvedContent = resolveJsonConflict(file.patch);
        } else if (fileType === ".md") {
          resolvedContent = resolveMarkdownConflict(file.patch);
        } else {
          console.warn(`Skipping unsupported file type: ${file.path}`);
        }

        if (resolvedContent) {
          // Update the file in the PR branch
          execSync(`echo "${resolvedContent}" > ${file.path}`);
          execSync(`git add ${file.path}`);
          execSync(`git commit -m "Resolve conflict in ${file.path}"`);
        }
      }
    }

    execSync(`git push origin ${prDetails.headRefName}`);
    return "Conflicts resolved based on file types.";
  } catch (error: any) {
    throw new Error(`Failed to resolve merge conflicts: ${error.message}`);
  }
}

/**
 * Resolves conflicts in the `pnpm-lock.yaml` file by following a structured process.
 * @param prBranch - The PR branch name.
 * @param baseBranch - The base branch name.
 */
function resolvePnpmLockConflict(prBranch: string, baseBranch: string): void {
  const pnpmLockPath = path.resolve("pnpm-lock.yaml");

  try {
    console.log("Fetching the latest changes from the main branch...");
    execSync(`git fetch origin ${baseBranch}`, { stdio: "inherit" });

    console.log(`Checking out the PR branch: ${prBranch}...`);
    execSync(`git checkout ${prBranch}`, { stdio: "inherit" });

    console.log(`Merging the main branch (${baseBranch}) into the PR branch...`);
    execSync(`git merge origin/${baseBranch}`, { stdio: "inherit" });

    console.log("Checking out the pnpm-lock.yaml file from the main branch...");
    execSync(`git checkout origin/${baseBranch} -- ${pnpmLockPath}`, { stdio: "inherit" });

    console.log("Running rush update to regenerate pnpm-lock.yaml...");
    execSync("rush update", { stdio: "inherit" });

    console.log("Adding the resolved pnpm-lock.yaml file...");
    execSync(`git add ${pnpmLockPath}`, { stdio: "inherit" });

    console.log("Committing the resolved pnpm-lock.yaml file...");
    execSync(
      `git commit -m "Resolved merge conflicts in pnpm-lock.yaml and ran rush update"`,
      { stdio: "inherit" }
    );

    console.log("Pushing the changes to the PR branch...");
    execSync(`git push origin ${prBranch}`, { stdio: "inherit" });

    console.log("Successfully resolved conflicts in pnpm-lock.yaml.");
  } catch (error: any) {
    throw new Error(`Failed to resolve pnpm-lock.yaml conflict: ${error.message}`);
  }
}

/**
 * Resolves conflicts in a JSON file by merging objects.
 * @param patch - The conflicting patch content.
 * @returns The resolved JSON content.
 */
function resolveJsonConflict(patch: string): string {
  // Simplified logic: Combine JSON objects (manual resolution may still be needed)
  try {
    const [base, head] = extractConflictSections(patch);
    const baseJson = JSON.parse(base);
    const headJson = JSON.parse(head);
    return JSON.stringify({ ...baseJson, ...headJson }, null, 2);
  } catch {
    console.warn("Failed to resolve JSON conflict automatically.");
    return patch;
  }
}

/**
 * Resolves conflicts in a Markdown file by combining changes.
 * @param patch - The conflicting patch content.
 * @returns The resolved Markdown content.
 */
function resolveMarkdownConflict(patch: string): string {
  // Simplified logic: Combine both sides of the conflict
  const [base, head] = extractConflictSections(patch);
  return `${base}\n\n${head}`;
}

/**
 * Extracts conflict sections from a patch.
 * @param patch - The conflicting patch content.
 * @returns An array with base and head sections.
 */
function extractConflictSections(patch: string): [string, string] {
  const conflictRegex = /<<<<<<< HEAD\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>>/;
  const match = patch.match(conflictRegex);
  if (match) {
    return [match[1].trim(), match[2].trim()];
  }
  throw new Error("No conflict markers found in the patch.");
}
