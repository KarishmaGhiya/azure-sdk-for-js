import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import * as path from "path";

/**
 * Resolves merge conflicts in a GitHub pull request based on file types.
 * Specifically handles conflicts in `pnpm-lock.yaml` by following a structured resolution process.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param pullNumber - Pull request number.
 * @param token - GitHub personal access token.
 * @returns A promise that resolves to a status message.
 */
export async function resolveMergeConflictsByFileType(
  owner: string,
  repo: string,
  pullNumber: number,
  token: string
): Promise<string> {
  const octokit = new Octokit({ auth: token });

  try {
    // Fetch PR details
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (pr.mergeable_state !== "dirty") {
      return `No conflicts to resolve. Mergeable state: ${pr.mergeable_state}`;
    }

    // Fetch conflicting files
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });

    for (const file of files) {
      if (file.filename === "pnpm-lock.yaml" && file.status === "modified") {
        resolvePnpmLockConflict(pr.head.ref, pr.base.ref);
        break;
      } else if (file.status === "modified" && file.patch) {
        const fileType = path.extname(file.filename);

        // Apply resolution logic based on file type
        let resolvedContent: string | null = null;
        if (fileType === ".json") {
          resolvedContent = resolveJsonConflict(file.patch);
        } else if (fileType === ".md") {
          resolvedContent = resolveMarkdownConflict(file.patch);
        } else {
          console.warn(`Skipping unsupported file type: ${file.filename}`);
        }

        if (resolvedContent) {
          // Update the file in the PR branch
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: file.filename,
            message: `Resolve conflict in ${file.filename}`,
            content: Buffer.from(resolvedContent).toString("base64"),
            sha: file.sha,
            branch: pr.head.ref,
          });
        }
      }
    }

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
