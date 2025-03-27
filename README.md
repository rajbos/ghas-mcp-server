# ghas-mpc-server
MPC server to make calls to GHAS for GitHub repositories.

Currently this has the following tools that are supported:
- list_dependabot_alerts: List all dependabot alerts for a repository
- list_secret_scanning_alerts: List all secret scanning alerts for a repository
- list_code_scanning_alerts: List all code scanning alerts for a repository

Make sure to add these three scopes (read only) to the configured PAT and for the correct organization as well!

# Example configuration
Add this to your comfiguration. For VS Code it would look like this:
``` json
  "ghas-mpc-server": {
      "command": "npx",
      "args": [
          "-y",
          "@rajbos/ghas-mpc-server"
      ],
      "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_your_values_here"
      }
  }
```

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
ghas-mpc-server/
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
