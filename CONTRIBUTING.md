# Contributing to TechHelp IT Solutions

Thanks for taking the time to contribute! Here's how to get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/TechHelp-IT-solution.git
   ```
3. Create a new branch for your feature or fix
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Make your changes, then commit using the conventions below
5. Push to your fork and open a **Pull Request**

---

## Commit Message Conventions

Keep commits small and focused. Use this format:

```
<type>: short description
```

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that isn't a fix or feature |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `chore` | Build process, dependency updates |

**Examples:**
```
feat: add password reset endpoint
fix: resolve token expiry issue on login
docs: update API reference in README
```

---

## Code Style

- Use **ES6+ syntax** (arrow functions, destructuring, template literals)
- Keep functions small and focused on one thing
- No commented-out code in PRs — delete it or open an issue instead
- Backend: always return a consistent `{ success, message, data }` JSON shape

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/sumankuity68-debug/TechHelp-IT-solution/issues) and use the **Bug Report** template.

---

## Questions

Feel free to open a Discussion or reach out via the contact form on the live site.
