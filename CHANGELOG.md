# Changelog

All notable changes to refinore-cli will be documented in this file.

## [1.0.0] - 2026-02-11

### Added
- Initial release of refinore-cli
- `init` command - Set up with refinORE API key
- `mine` command - Start mining sessions with full configuration options
- `status` command - View active mining session and current round info
- `balance` command - Check wallet token balances (SOL, ORE, USDC, stORE, SKR)
- `stop` command - Stop active mining session
- `history` command - View recent mining rounds and P&L
- `deposit` command - Show deposit instructions
- `whoami` command - Display account information
- `--auto-mine` flag for quick one-command setup and mining
- Interactive prompts for all configuration options
- Color-coded output with spinners and tables
- Config storage at `~/.refinore/config.json`
- Support for multi-coin mining (SOL, USDC, ORE, stORE, SKR)
- Support for tile selection strategies (optimal, random, custom)
- Risk tolerance settings (low, medium, high)
- Auto-restart functionality
- Comprehensive error handling and user feedback

### Features
- TypeScript implementation with full type safety
- Commander.js for robust CLI argument parsing
- Chalk for colorful output
- Ora for loading spinners
- CLI Table3 for formatted data display
- Inquirer for interactive prompts
- Support for environment variables (REFINORE_API_KEY, REFINORE_API_URL)

### Documentation
- Comprehensive README with quick start guide
- Full command reference with examples
- Mining strategy documentation
- Troubleshooting guide
