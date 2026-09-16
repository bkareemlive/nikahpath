# Working on NikahPathway

`main` is the integration branch and is always deployable. All changes land on
`main` through a pull request from a short-lived branch — nothing is committed to
`main` directly.

## The loop

```bash
git switch main && git pull            # start from the latest main
git switch -c feature/<short-name>     # branch (see naming below)

# ...make changes, commit as you go...
npm run lint && npm run build          # must pass before pushing

git push                               # upstream is created automatically
gh pr create --base main --fill        # or open the PR from the GitHub UI
```

After the PR is merged (squash):

```bash
git switch main && git pull
git branch -d feature/<short-name>     # delete the local branch
```

## Branch names

`<type>/<short-kebab-summary>` — keep it under ~5 words.

| Type | For |
| --- | --- |
| `feature/` | new functionality |
| `fix/` | bug fixes |
| `chore/` | tooling, deps, config, refactors with no behaviour change |
| `docs/` | documentation only |

Examples: `feature/nudges`, `fix/browse-age-filter`, `chore/bump-node-22`.

## Commits

- Small, focused commits with a present-tense summary line ("Add …", "Fix …").
- Body explains *why* when it isn't obvious from the diff.
- End every commit message with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```

## Pull requests

- Title summarises the change; body covers **what changed, why, and anything a
  reviewer should know** (new env vars, a migration to run, a manual test).
- Call out any `supabase/migrations/*` file added — it must be applied to the
  project (SQL Editor or `supabase db push`) as part of the merge.
- Open as **ready for review**, not draft, unless the work is incomplete.
- Squash-merge; delete the branch on merge.

## Local checks before pushing

```bash
npm run lint      # eslint — must be clean
npm run build     # next build — must pass (also type-checks)
```

## One-time setup on a new machine

```bash
git config --local push.autoSetupRemote true   # git push creates the upstream
git config --local pull.rebase true             # rebase on pull, linear history
winget install --id GitHub.cli -e               # for `gh pr create`
gh auth login
```

## Recommended: protect `main` on GitHub

Settings → Branches → add a rule for `main`:

- Require a pull request before merging
- Require status checks to pass (add CI once it exists)
- Do not allow direct pushes / force pushes
