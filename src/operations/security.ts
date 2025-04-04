import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";

/**
 * Retrieves the GitHub Personal Access Token from the environment variables or using the `gh` CLI.
 * @returns The GitHub Personal Access Token.
 * @throws An error if the token is not set or cannot be retrieved.
 */
export function getGitHubToken(): string {
    try {
        const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
        if (!token) {
            throw new Error("Failed to retrieve GitHub token using gh CLI.");
        }
        return token;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error retrieving GitHub token: ${error.message}`);
        }
        throw new Error("Error retrieving GitHub token: An unknown error occurred.");
    }
}

/**
 * Validates the presence of the GitHub Personal Access Token in the environment variables.
 * @throws An error if the token is not set.
 */
async function validateAccessToken(owner: string, repo: string): Promise<Octokit> {

    console.log("Validating GitHub Personal Access Token...");

    let authToken = null;
    if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI) {
        const token = getGitHubToken();
        authToken = token;
    } else {
        if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
            throw new Error("GITHUB_PERSONAL_ACCESS_TOKEN is not set in environment variables. This is needed to be able to find code scanning alerts.");
        } else {
            console.log(`GITHUB_PERSONAL_ACCESS_TOKEN is set in environment variables with length: [${process.env.GITHUB_PERSONAL_ACCESS_TOKEN.length}]`);
            authToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN.trim();
        }
    }

    const octokit = new Octokit({
        auth: authToken
    });

    // Validate token access and scope
    try {
        console.log("Starting to validate token access and scope...");
        const user = await octokit.rest.users.getAuthenticated();
        console.log(`Authenticated as: [${user.data.login}]`);
        const repoInfo = await octokit.rest.repos.get({
            owner,
            repo
        });

        console.log(`Repository information fetched: [${repoInfo.data.name}]`);
        if (!repoInfo.data.permissions || !repoInfo.data.permissions.admin) {
            throw new Error("The provided token does not have admin access to the repository. Admin access is required to fetch security information.");
        } else {
            console.log("Token has admin access to the repository.");
        }
        console.log("Token has sufficient permissions for the repository.");
    } catch (error) {
        console.error("Error validating token or repository access:", error);
        throw new Error("Failed to validate token or repository access. Ensure the token has the necessary scopes and permissions.");
    }

    return octokit;
}

/**
 * Lists the current GitHub Advanced Security code scanning alerts for a repository.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @returns A list of code scanning alerts.
 */
export async function listCodeScanningAlerts(owner: string, repo: string) {
    const octokit = await validateAccessToken(owner, repo);

    console.log(`Fetching code scanning alerts for repository: [${owner}/${repo}]`);
    try {
        const { data } = await octokit.codeScanning.listAlertsForRepo({
            owner,
            repo
        });
        console.log(`Fetched [${data.length}] code scanning alerts.`);
        return data;
    } catch (error) {
        console.error("Error fetching code scanning alerts:", error);
        throw error;
    }
}

/**
 * Lists the current GitHub Advanced Security secret scanning alerts for a repository.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @returns A list of secret scanning alerts.
 */
export async function listSecretScanningAlerts(owner: string, repo: string) {
    const octokit = await validateAccessToken(owner, repo);

    console.log(`Fetching secret scanning alerts for repository: [${owner}/${repo}]`);
    console.log("Starting to fetch secret scanning alerts...");
    try {
        const { data } = await octokit.rest.secretScanning.listAlertsForRepo({
            owner,
            repo
        });
        console.log(`Fetched [${data.length}] secret scanning alerts.`);
        return data;
    } catch (error) {
        console.error("Error fetching secret scanning alerts:", error);
        throw error;
    }
}

/**
 * Lists the current GitHub Dependabot alerts for a repository.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @returns A list of Dependabot alerts.
 */
export async function listDependabotAlerts(owner: string, repo: string) {
    const octokit = await validateAccessToken(owner, repo);

    console.log(`Fetching Dependabot alerts for repository: [${owner}/${repo}]`);
    console.log("Starting to fetch Dependabot alerts...");
    try {
        const { data } = await octokit.rest.dependabot.listAlertsForRepo({
            owner,
            repo
        });
        console.log(`Fetched [${data.length}] Dependabot alerts.`);
        return data;
    } catch (error) {
        console.error("Error fetching Dependabot alerts:", error);
        throw error;
    }
}
