# ghas-mcp-server
MCP server to make calls to GHAS for GitHub repositories.

Currently this has the following tools that are supported:
- list_dependabot_alerts: List all dependabot alerts for a repository
- list_secret_scanning_alerts: List all secret scanning alerts for a repository
- list_code_scanning_alerts: List all code scanning alerts for a repository

Make sure to add these three scopes (read only) to the configured PAT and for the correct organization as well!


# Install in VS Code and VS Code Insiders

[<img alt="Install in VS Code" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF">](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522ghas-mcp-server%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540rajbos%252Fghas-mcp-server%2522%255D%252C%2522inputs%2522%253A%255B%257B%2522id%2522%253A%2522github_personal_access_token%2522%252C%2522description%2522%253A%2522GitHub%2520Personal%2520Access%2520Token%2522%252C%2522type%2522%253A%2522password%2522%257D%255D%257D)

[<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522ghas-mcp-server%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540rajbos%252Fghas-mcp-server%2522%255D%252C%2522inputs%2522%253A%255B%257B%2522id%2522%253A%2522github_personal_access_token%2522%252C%2522description%2522%253A%2522GitHub%2520Personal%2520Access%2520Token%2522%252C%2522type%2522%253A%2522password%2522%257D%255D%257D)


# Example configuration
Add this to your comfiguration. For VS Code it would look like this:
``` json
{
    "mcp": {
        "inputs": [
            {
                "id": "github_personal_access_token",
                "description": "GitHub Personal Access Token",
                "password": true
            }
        ]
    },
    "servers": {
        "ghas-mcp-server": {
            "command": "npx",
            "args": [
                "-y",
                "@rajbos/ghas-mcp-server"
            ],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "${inputs:github_personal_access_token}"
            }
        }
    }
  }
```

# Results
![Screenshot of the output inside of VS Code](/docs/result.png)

# Contributing
Contributions are welcome! If you have ideas for new tools or improvements, please open an issue or submit a pull request.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

```

## Project Structure

```
ghas-mcp-server/
├── src/
│   ├── operations/      # MCP Tools
│   │   └── security.ts
│   └── index.ts         # Server entry point
├── package.json
└── tsconfig.json
```

## Adding Components

The project comes with the GHAS tools in `src/operations/security.ts`.
## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
