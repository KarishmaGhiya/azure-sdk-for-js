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
        
        if (prData.mergeable === false) {
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
    const conflictRegex = /diff --cc (.+)\n(?:.|\n)*?@@@/g;
    let match;

    while ((match = conflictRegex.exec(diff)) !== null) {
        conflicts.push({
            file: match[1],
            conflictDetails: "Conflict detected in this file.",
        });
    }

    return conflicts;
}