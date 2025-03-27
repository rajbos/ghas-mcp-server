import { Octokit } from "@octokit/rest";
/**
 * Lists the current GitHub Advanced Security code scanning alerts for a repository.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @returns A list of code scanning alerts.
 */
export async function listCodeScanningAlerts(owner: string, repo: string) {
    // check if we have an auth token to use
    if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
        throw new Error("GITHUB_PERSONAL_ACCESS_TOKEN is not set in environment variables. This is needed to be able to find code scanning alerts.");
    }
    else {
        console.log(`GITHUB_PERSONAL_ACCESS_TOKEN is set in environment variables with length: [${process.env.GITHUB_PERSONAL_ACCESS_TOKEN.length}]`);
    }
    console.log(`Fetching code scanning alerts for repository: [${owner}/${repo}]`);
    const octokit = new Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    });

    // Validate token access and scope
    try {
        const user = await octokit.rest.users.getAuthenticated();
        console.log(`Authenticated as: [${user.data.login}]`);
        const repoInfo = await octokit.rest.repos.get({
            owner,
            repo
        });

        console.log(`Repository information fetched: [${repoInfo.data.name}]`);
        if (!repoInfo.data.permissions || !repoInfo.data.permissions.admin) {
            throw new Error("The provided token does not have admin access to the repository. Admin access is required to fetch security information.");
        }
        else {
            console.log("Token has admin access to the repository.");
        }
        console.log("Token has sufficient permissions for the repository.");
    }
    catch (error) {
        console.error("Error validating token or repository access:", error);
        throw new Error("Failed to validate token or repository access. Ensure the token has the necessary scopes and permissions.");
    }

    console.log("Starting to fetch code scanning alerts...");
    try {
        const { data } = await octokit.codeScanning.listAlertsForRepo({
            owner,
            repo
        });
        console.log(`Fetched [${data.length}] code scanning alerts.`);
        return data;
    }
    catch (error) {
        console.error("Error fetching code scanning alerts:", error);
        throw error;
    }
}
