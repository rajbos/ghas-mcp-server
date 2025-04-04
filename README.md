# ghas-mcp-server
MCP server to make calls to GHAS for GitHub repositories.

Currently this has the following tools that are supported:
- list_dependabot_alerts: List all dependabot alerts for a repository
- list_secret_scanning_alerts: List all secret scanning alerts for a repository
- list_code_scanning_alerts: List all code scanning alerts for a repository

Make sure to add these three scopes (read only) to the configured PAT and for the correct organization as well!


# Install in VS Code and VS Code Insiders
Use the buttons to install the server in your VS Code or VS Code Insiders environment. Make sure to read the link before you trust it! The links go to `vscode.dev` and `insiders.vscode.dev` and contain instructions to install the server. 

VS Code will let you see the configuration before anything happens:

![Screenshot of the configuration in VS Code](/docs/install_dialogue.png)  

[<img alt="Install in VS Code" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF">](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522ghas-mcp-server%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540rajbos%252Fghas-mcp-server%2522%255D%252C%2522env%2522%253A%257B%2522GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI%2522%253A%2522true%2522%257D%257D) [<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522ghas-mcp-server%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540rajbos%252Fghas-mcp-server%2522%255D%252C%2522env%2522%253A%257B%2522GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI%2522%253A%2522true%2522%257D%257D)


# Example configuration
Add the configurations below to your MCP config in the editor. 

## Secure option: use the authenticated GitHub CLI
Instead of storing a Personal Access Token (see next section), you can also use the authenticated GitHub CLI. This will use the credentials you have configured in your GitHub CLI. This is useful when you have the GitHub CLI installed and already authenticated.

To use the GitHub CLI for authentication, follow the steps below:
- Add `"GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI": "true"` to your environment variables.
- Ensure you have the GitHub CLI installed and authenticated by running `gh auth login`.

Configuration: 
``` json
{
    "mcp": {
        "inputs": [
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
                "GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI": "true"
            }
        }
    }
  }
```

## Configuration with a personal access token
For VS Code it would look like this:
``` json
{
    "mcp": {
        "inputs": [
            {
                "id": "github_personal_access_token",
                "description": "GitHub Personal Access Token",
                "type": "promptString",
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
                "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_personal_access_token}"
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

## Building

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

### Testing the local build
You can test your local build by configuring the locally build version with the following MCP config:

```json
"servers": {
    "ghas-mcp-server": {
        "command": "node",
        "args": [
            "C:/Users/RobBos/Code/Repos/rajbos/ghas-mpc-server/dist/index.js"
        ],
        "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN_USE_GHCLI": "true"
        }
    }
}
```
Don't forget to change the path to your local build and build the project first!

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
