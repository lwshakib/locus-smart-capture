# Contributing to Locus Smart Capture

Welcome! We are excited that you want to contribute to **Locus Smart Capture**. Follow these guidelines to set up your environment, follow our coding standards, and submit your code modifications successfully.

---

## 🚀 Setting Up Your Workspace

### 1. Clone & Fork the Repository
First, fork the repository on GitHub and clone your fork locally:
```bash
git clone https://github.com/your-username/locus-smart-capture.git
cd locus-smart-capture
```

### 2. Configure Remote Upstream
Keep your local workspace in sync with the parent project:
```bash
git remote add upstream https://github.com/lwshakib/locus-smart-capture.git
```

### 3. Install Workspace Dependencies
Locus is a pnpm monorepo. Never use `npm` or `yarn` directly; always run **`pnpm`** to manage packages:
```bash
pnpm install
```

---

## 🌿 Branching & Git Workflow

### 1. Create a Topic Branch
Always develop inside a feature-specific branch. Base your branch off the `main` branch and use clean naming formats:
```bash
# For bug fixes
git checkout -b fix/issue-description

# For new features
git checkout -b feature/cool-new-tool
```

### 2. Adding / Installing Dependencies
If you need to install new npm packages in a specific app or shared package:
```bash
# Add to apps/desktop workspace
pnpm --filter desktop add <package-name>

# Add to apps/chrome-extension workspace
pnpm --filter chrome-extension add <package-name>

# Add to apps/web workspace
pnpm --filter web add <package-name>
```

---

## 🛠️ Validation Before Submitting

Locus runs rigid validation gates on pull requests. Before committing your code, make sure it passes all linting, formatting, and type compilation checks:

### 1. Run Linter
Checks code styles and formats:
```bash
pnpm lint
```

### 2. Verify Type Safety
Ensure TypeScript builds perfectly with zero compilation warnings:
```bash
# For Desktop App
pnpm --filter desktop exec tsc --noEmit

# For Chrome Extension
pnpm --filter chrome-extension exec tsc --noEmit
```

### 3. Verify Product Packaging
Verify that build bundlers succeed for all platforms:
```bash
pnpm build
```

---

## 📤 Submitting a Pull Request (PR)

1.  **Commit Changes**: Write concise, descriptive commit messages.
    ```bash
    git commit -m "feat(desktop): minimize to system tray automatically on startup"
    ```
2.  **Push to Your Fork**:
    ```bash
    git push origin feature/cool-new-tool
    ```
3.  **Open a Pull Request**: Go to the Locus repository on GitHub, click **New Pull Request**, and fill in the PR checklist template we've provided in [PULL_REQUEST_TEMPLATE.md](file:///e:/locus-smart-capture/.github/PULL_REQUEST_TEMPLATE.md).
4.  **Code Review**: Maintainers will review your code. Answer questions, make adjustments if requested, and enjoy contributing to Locus Smart Capture!
