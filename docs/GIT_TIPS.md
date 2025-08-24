# Git & Terminal Tips (Windows)

## Avoid terminal stalls

- Disable git pager:  
  `git config --global core.pager cat`  
  `git config --global interactive.diffFilter cat`  
  Run with no-pager: `git --no-pager log --oneline -n 1`

## Prettier without PowerShell policy issues

- Use npm exec: `npm exec -- prettier -w <files>`  
  or use cmd wrapper: `cmd /c npx prettier -w <files>`

## Only format changed docs

- `npx prettier -w docs/CURRENT_STATE.md docs/BASELINE.md`
- Don’t run Prettier on the whole repo unless needed.

## Move repo out of OneDrive safely

- Copy with robocopy (brings .git):

robocopy "C:\Users<you>\OneDrive\Documents\The-Slab-Station" ^
"C:\Dev\The-Slab-Station" /MIR /COPY:DAT /R:1 /W:1 /NFL /NDL /NP

- Open new folder in Cursor/VS Code: `C:\Dev\The-Slab-Station`

## Quick checks

- Short SHA: `git --no-pager rev-parse --short HEAD`
- Remote: `git --no-pager remote -v`
- Status: `git --no-pager status`
