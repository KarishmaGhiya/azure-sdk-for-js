import { execSync } from 'child_process';

/**
 * Resolves merge conflicts in a PR using GitHub CLI.
 * @param prNumber - The pull request number.
 * @param resolutionStrategy - The resolution strategy (e.g., "ours" or "theirs").
 */
export function resolveMergeConflicts(prNumber: number, resolutionStrategy: 'ours' | 'theirs') {
    try {
        console.log(`Fetching pull request #${prNumber}...`);
        execSync(`gh pr checkout ${prNumber}`, { stdio: 'inherit' });

        console.log('Attempting to merge the PR...');
        execSync('git merge main', { stdio: 'inherit' });

        console.log('Resolving conflicts...');
        execSync(`git merge-file --strategy=${resolutionStrategy}`, { stdio: 'inherit' });

        console.log('Adding resolved files...');
        execSync('git add .', { stdio: 'inherit' });

        console.log('Committing resolved merge...');
        execSync('git commit -m "Resolve merge conflicts"', { stdio: 'inherit' });

        console.log('Pushing resolved changes...');
        execSync('git push', { stdio: 'inherit' });

        console.log('Merge conflicts resolved successfully!');
    } catch (error) {
        console.error('Error resolving merge conflicts:', error);
        process.exit(1);
    }
}