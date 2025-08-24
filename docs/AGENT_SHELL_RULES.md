# Agent Shell Rules (Windows)

**Terminal**

- Prefer **Command Prompt (cmd.exe)** in Cursor: Terminal → Select Default Profile → Command Prompt.
- If running in **PowerShell**, do not chain with `&&`. Run commands one-per-line.

**Git / Pager**

- Global (recommended once):

git config --global core.pager cat
git config --global interactive.diffFilter cat

- Optional env:

setx GIT_PAGER cat
setx LESS "-F -X"

**Format & Commit Patterns**

- cmd.exe (chained):

cd /d C:\Dev\The-Slab-Station && cmd /c npx prettier -w <files> && git add <files> && git commit -m "short msg" && git push

- PowerShell (one per line):

cmd /c npx prettier -w <files>
git add <files>
git commit -m "short msg"
git push

**Troubleshooting**

- If `npx` is blocked: `npm exec -- prettier -w <files>`
- If pager still opens: use `git --no-pager <cmd>`
- If terminal stuck: open a new terminal tab and re-run one-per-line.
