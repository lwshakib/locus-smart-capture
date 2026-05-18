## Locus Smart Capture - Pull Request Checklist

### Description

Provide a concise overview of the problem this PR solves and the technical decisions you made during the changes.

### Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Chore / Documentation / Build system update

### Proposed Components Affected

- [ ] `apps/desktop` (Electron Capture App)
- [ ] `apps/chrome-extension` (Chrome Overlay Capture Tool)
- [ ] `apps/web` (Dashboard & Download site)
- [ ] `packages/ui` (Shared React Tailwind components)

### How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

- **Manual Verification Steps**:
  1. ...
  2. ...

### Checklist

- [ ] My code follows the style guidelines of this project
- My changes pass local lint and TypeScript compilation checks:
  - [ ] Checked `apps/desktop` via `pnpm --filter desktop exec tsc --noEmit`
  - [ ] Checked `apps/chrome-extension` via `pnpm --filter chrome-extension exec tsc --noEmit`
  - [ ] Ran global linter `pnpm lint`
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or console errors
