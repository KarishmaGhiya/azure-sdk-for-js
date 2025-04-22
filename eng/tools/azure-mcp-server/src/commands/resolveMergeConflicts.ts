import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

interface MergeResolutionResult {
  success: boolean;
  message: string;
  wasResolved: boolean;
  commitSha?: string;
  resolvedFiles?: string[];
  error?: string;
}

/**
 * Resolves merge conflicts in a PR using GitHub CLI.
 * @param owner - The repository owner (user or organization)
 * @param repo - The repository name
 * @param prNumber - The pull request number
 * @param token - GitHub token for authentication
 * @param resolutionStrategy - The resolution strategy (e.g., "ours" or "theirs")
 * @returns A promise that resolves to the merge resolution result
 */
export async function resolveMergeConflicts(
  owner: string,
  repo: string,
  prNumber: number, 
  token: string,
  resolutionStrategy: 'ours' | 'theirs'
): Promise<MergeResolutionResult> {
    // Create a temporary directory for our operations
    const tmpDir = path.join(os.tmpdir(), `gh-resolve-conflicts-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    
    // Store current directory to return to it later
    const currentDir = process.cwd();
    
    try {
        // Set up GitHub token for CLI authentication
        process.env.GITHUB_TOKEN = token;
        
        // Clone the repository to the temp directory
        console.log(`Cloning repository ${owner}/${repo}...`);
        await execAsync(`gh repo clone ${owner}/${repo} ${tmpDir}`);
        
        // Change to the repository directory
        process.chdir(tmpDir);
        
        console.log(`Fetching pull request #${prNumber}...`);
        await execAsync(`gh pr checkout ${prNumber}`);

        // Get list of files to track which ones get resolved
        const { stdout: filesBefore } = await execAsync('git status --porcelain');
        
        console.log('Attempting to merge the PR...');
        try {
            await execAsync('git merge main');
            // If we get here, there were no conflicts
            return {
                success: true,
                message: 'No conflicts detected when merging with main branch.',
                wasResolved: false
            };
        } catch (mergeError) {
            // This is expected - the merge will fail if there are conflicts
            console.log('Conflicts detected, proceeding with resolution strategy...');
        }
        
        // Get list of conflicted files
        const { stdout: conflictOutput } = await execAsync('git diff --name-only --diff-filter=U');
        const conflictedFiles = conflictOutput.trim().split('\n').filter(Boolean);
        
        if (conflictedFiles.length === 0) {
            return {
                success: false,
                message: 'No conflict files found, but merge failed for another reason.',
                wasResolved: false,
                error: 'Unknown merge error'
            };
        }
        
        // Resolve each conflicted file
        for (const file of conflictedFiles) {
            console.log(`Resolving conflicts in ${file}...`);
            await execAsync(`git checkout --${resolutionStrategy} ${file}`);
            await execAsync(`git add ${file}`);
        }
        
        console.log('Committing resolved merge...');
        await execAsync(`git commit -m "Resolve merge conflicts using ${resolutionStrategy} strategy"`);

        console.log('Pushing resolved changes...');
        await execAsync('git push');
        
        // Get the commit SHA
        const { stdout: shaOutput } = await execAsync('git rev-parse HEAD');
        const commitSha = shaOutput.trim();

        return {
            success: true,
            message: `Merge conflicts resolved successfully using "${resolutionStrategy}" strategy.`,
            wasResolved: true,
            commitSha,
            resolvedFiles: conflictedFiles
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error resolving merge conflicts',
            wasResolved: false,
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        // Return to original directory
        process.chdir(currentDir);
        
        // Clean up temp directory
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch (cleanupError) {
            console.error('Failed to clean up temporary directory:', cleanupError);
        }
    }
}