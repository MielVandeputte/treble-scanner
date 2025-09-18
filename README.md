## 📦 Project Status

| Branch    | Validation Status                                                                                                                                                                                              |
| --------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `main`    | [![Validation](https://github.com/MielVandeputte/treble-scanner/actions/workflows/validation.yml/badge.svg?branch=main)](https://github.com/MielVandeputte/treble-scanner/actions/workflows/validation.yml)    |
| `staging` | [![Validation](https://github.com/MielVandeputte/treble-scanner/actions/workflows/validation.yml/badge.svg?branch=staging)](https://github.com/MielVandeputte/treble-scanner/actions/workflows/validation.yml) |

---

## ✏️ Commit Naming Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/).

**Types:**
- `build:` 📦 Build system or external dependencies
- `chore:` 🔧 Routine tasks, no production impact
- `ci:` 🤖 CI configuration or scripts
- `docs:` 📝 Documentation only changes
- `feat:` ✨ A new feature
- `fix:` 🐛 A bug fix
- `perf:` ⚡ Performance improvements
- `refactor:` 🔄 Code change that doesn't fix a bug or add a feature
- `style:` 💄 Code style changes (formatting, missing semi-colons, etc.)
- `test:` 🧪 Adding or updating tests

---

## 🔀 Merge Strategy

Use fast-forward only for merging `staging` into `main`:

```bash
git merge --ff-only origin/staging
```
