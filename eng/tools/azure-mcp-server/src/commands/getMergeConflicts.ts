import { Octokit } from "@octokit/rest";

interface MergeConflict {
    file: string;
    conflictDetails: string;
}

export async function getMergeConflicts(
    owner: string,
    repo: string,
    pullNumber: number,
    token: string
): Promise<MergeConflict[]> {
    const octokit = new Octokit({ auth: token });

    try {
        const response = await octokit.repos.getPullRequestMergeable({
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

            const conflicts = parseMergeConflicts(diffResponse.data);
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