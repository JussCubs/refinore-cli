# Changelog

All notable changes to refinore-cli will be documented in this file.

## [1.1.0] - 2026-02-11

### Added
- Advanced threshold parameters for intelligent automated mining:
  - `--ev-min <number>` - Only mine rounds where Expected Value > threshold %
  - `--motherlode-min <number>` - Only mine when motherlode jackpot > threshold ORE
  - `--sol-deployed-max <number>` - Automatically stop after deploying threshold SOL total
- Optional threshold configuration during `refinore init`
- Threshold display in `refinore status` when set
- Backend API now accepts `ev_threshold`, `motherlode_threshold`, and `sol_deployed_max` parameters
- Enhanced documentation with threshold-based strategy examples

### Changed
- Default mining behavior now mines all rounds (no risk-based filtering)
- Updated all documentation to reflect threshold-based approach
- Improved `refinore status` output to show active thresholds

### Removed
- `--risk` / `-r` flag (low/medium/high) - replaced with advanced thresholds
- Risk tolerance from API calls
- Risk tolerance mentions from all documentation

### Migration Guide
**Before (v1.0.x):**
```bash
refinore mine -a 0.01 -t 15 -r medium
```

**After (v1.1.0):**
```bash
# Mine all rounds (new default)
refinore mine -a 0.01 -t 15

# Or use thresholds for smarter mining
refinore mine -a 0.01 -t 15 --ev-min 5 --motherlode-min 100
```

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
