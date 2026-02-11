# Publishing Guide for refinore-cli

## Pre-publish Checklist

### ✅ Code Quality
- [x] All TypeScript compiles without errors
- [x] No runtime errors in basic commands
- [x] All commands have help text
- [x] Error handling works properly

### ✅ Package Structure
- [x] `package.json` has correct metadata
- [x] `bin` field points to `dist/index.js`
- [x] `dist/index.js` has shebang (`#!/usr/bin/env node`)
- [x] `dist/index.js` is executable
- [x] `.npmignore` excludes source files
- [x] `dependencies` are correct (no dev deps in prod)

### ✅ Documentation
- [x] `README.md` with quick start guide
- [x] `EXAMPLES.md` with usage examples
- [x] `CHANGELOG.md` with version history
- [x] `LICENSE` file (MIT)
- [x] All commands documented

### ✅ Testing
- [x] `npm run build` works
- [x] `node dist/index.js --help` works
- [x] All commands show proper help
- [x] Error states handled gracefully

## Publishing Steps

### 1. Verify Package
```bash
cd /home/ralph/cook/refinore-cli

# Check package.json
cat package.json

# Verify build
npm run build

# Test locally
node dist/index.js --help
```

### 2. Test Installation Locally
```bash
# Create a test directory
cd /tmp
mkdir refinore-test && cd refinore-test

# Pack the package
cd /home/ralph/cook/refinore-cli
npm pack

# Install from tarball
cd /tmp/refinore-test
npm install /home/ralph/cook/refinore-cli/refinore-cli-1.0.0.tgz

# Test the binary
npx refinore --help
```

### 3. Publish to npm

#### First time setup:
```bash
npm login
# Enter your npm credentials
```

#### Publish:
```bash
cd /home/ralph/cook/refinore-cli

# Dry run (see what would be published)
npm publish --dry-run

# Publish for real
npm publish
```

### 4. Verify Published Package
```bash
# Wait 1-2 minutes for npm to propagate

# Install from npm
npm install -g refinore-cli

# Test
refinore --help
refinore mine --help

# Or test with npx
npx refinore-cli --help
```

### 5. Test the --auto-mine Flow
```bash
npx -y refinore-cli --auto-mine
# Should prompt for API key if not configured
```

## Post-publish

### Update Documentation
- [ ] Add npm install instructions to README
- [ ] Update version badges
- [ ] Add link to npm package page

### Announce
- [ ] Post in refinORE Discord
- [ ] Share on Twitter/X
- [ ] Add to refinORE docs

### Monitor
- [ ] Check npm downloads
- [ ] Monitor GitHub issues
- [ ] Respond to questions

## Version Updates

For future releases:

```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Build
npm run build

# Publish
npm publish
```

## Troubleshooting

### "Package already exists"
- Increase version in `package.json`
- Run `npm publish` again

### "Binary not found after install"
- Check `bin` field in `package.json`
- Verify `dist/index.js` has shebang
- Check file permissions

### "Module not found" errors
- Verify all dependencies in `package.json`
- Check `tsconfig.json` module settings
- Ensure dist/ is included in package

## Package Contents

Files included in npm package:
```
refinore-cli/
├── dist/           # Compiled JavaScript (INCLUDED)
│   ├── index.js
│   ├── api.js
│   ├── config.js
│   ├── utils.js
│   └── commands/
├── package.json    # INCLUDED
├── README.md       # INCLUDED
├── LICENSE         # INCLUDED
├── CHANGELOG.md    # INCLUDED (optional)
└── EXAMPLES.md     # INCLUDED (optional)
```

Files excluded (via .npmignore):
```
src/               # TypeScript source
tsconfig.json      # TS config
node_modules/      # Dependencies (users will install)
*.log             # Log files
.git/             # Git data
```

## Current Status

**Version:** 1.0.0  
**Ready to publish:** ✅ YES  

All checks passed. Package is ready for npm publish!

## npm Commands Reference

```bash
# Login to npm
npm login

# Check who you're logged in as
npm whoami

# Publish (public package)
npm publish

# Publish with tag
npm publish --tag beta

# Unpublish (within 72 hours)
npm unpublish refinore-cli@1.0.0

# Update package
npm version patch && npm publish

# View package info
npm view refinore-cli

# Check package size
npm pack --dry-run
```
