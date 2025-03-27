#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { listCodeScanningAlerts, listSecretScanningAlerts, listDependabotAlerts } from "./operations/security.js";
import { GitHubValidationError, GitHubResourceNotFoundError, GitHubAuthenticationError, GitHubPermissionError, GitHubRateLimitError, GitHubConflictError, isGitHubError, GitHubError, } from './common/errors.js';
import { VERSION } from "./common/version.js";
const server = new Server({
    name: "github-mcp-server",
    version: VERSION,
}, {
    capabilities: {
        tools: {},
    },
});
function formatGitHubError(error: GitHubError) {
    let message = `GitHub API Error: ${error.message}`;
    if (error instanceof GitHubValidationError) {
        message = `Validation Error: ${error.message}`;
        if (error.response) {
            message += `\nDetails: ${JSON.stringify(error.response)}`;
        }
    }
    else if (error instanceof GitHubResourceNotFoundError) {
        message = `Not Found: ${error.message}`;
    }
    else if (error instanceof GitHubAuthenticationError) {
        message = `Authentication Failed: ${error.message}`;
    }
    else if (error instanceof GitHubPermissionError) {
        message = `Permission Denied: ${error.message}`;
    }
    else if (error instanceof GitHubRateLimitError) {
        message = `Rate Limit Exceeded: ${error.message}\nResets at: ${error.resetAt.toISOString()}`;
    }
    else if (error instanceof GitHubConflictError) {
        message = `Conflict: ${error.message}`;
    }
    return message;
}
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_code_scanning_alerts",
                description: "List the current GitHub Advanced Security code scanning alerts for a repository",
                inputSchema: zodToJsonSchema(z.object({
                    owner: z.string(),
                    repo: z.string(),
                })),
            },
            {
                name: "list_secret_scanning_alerts",
                description: "List the current GitHub Advanced Security secret scanning alerts for a repository",
                inputSchema: zodToJsonSchema(z.object({
                    owner: z.string(),
                    repo: z.string(),
                })),
            },
            {
                name: "list_dependabot_alerts",
                description: "List the current GitHub Dependabot alerts for a repository",
                inputSchema: zodToJsonSchema(z.object({
                    owner: z.string(),
                    repo: z.string(),
                })),
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        if (!request.params.arguments) {
            throw new Error("Arguments are required");
        }
        switch (request.params.name) {
            case "list_code_scanning_alerts": {
                const args = z.object({ owner: z.string(), repo: z.string() }).parse(request.params.arguments);
                const alerts = await listCodeScanningAlerts(args.owner, args.repo);
                return {
                    content: [{ type: "text", text: JSON.stringify(alerts, null, 2) }],
                };
            }
            case "list_secret_scanning_alerts": {
                const args = z.object({ owner: z.string(), repo: z.string() }).parse(request.params.arguments);
                const alerts = await listSecretScanningAlerts(args.owner, args.repo);
                return {
                    content: [{ type: "text", text: JSON.stringify(alerts, null, 2) }],
                };
            }
            case "list_dependabot_alerts": {
                const args = z.object({ owner: z.string(), repo: z.string() }).parse(request.params.arguments);
                const alerts = await listDependabotAlerts(args.owner, args.repo);
                return {
                    content: [{ type: "text", text: JSON.stringify(alerts, null, 2) }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${request.params.name}`);
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        if (isGitHubError(error)) {
            throw new Error(formatGitHubError(error));
        }
        throw error;
    }
});
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("GitHub MCP Server running on stdio");
}
runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
