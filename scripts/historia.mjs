// Crea la rama de una historia de usuario a partir de la rama de iteración más reciente.
// Uso: npm run historia -- 05      → crea h-05 desde origin/it-NN y la sube a GitHub
import { execSync } from 'node:child_process';

// stdio 'pipe' para que funcione igual en PowerShell, cmd y Git Bash
const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
const num = (process.argv[2] ?? '').padStart(2, '0');

if (!/^\d{2}$/.test(num)) {
  console.error('Uso: npm run historia -- <número de historia>   (p. ej. npm run historia -- 05)');
  process.exit(1);
}
if (sh('git status --porcelain --untracked-files=no')) {
  console.error('Tienes cambios sin guardar. Haz commit o git stash antes de cambiar de historia.');
  process.exit(1);
}

sh('git fetch origin --prune');
const iteraciones = sh('git branch -r --list "origin/it-*"')
  .split('\n').map((b) => b.trim()).filter((b) => /^origin\/it-\d{2}$/.test(b)).sort();
if (iteraciones.length === 0) {
  console.error('No existe ninguna rama de iteración (it-NN) en GitHub. Pide que se cree primero.');
  process.exit(1);
}
const it = iteraciones.at(-1).replace('origin/', '');
const rama = `h-${num}`;

if (sh(`git ls-remote --heads origin ${rama}`)) {
  try { sh(`git switch ${rama}`); } catch { sh(`git switch -c ${rama} --track origin/${rama}`); }
  console.log(`La rama ${rama} ya existía: te has cambiado a ella.`);
} else {
  sh(`git switch -c ${rama} origin/${it}`);
  sh(`git push -u origin ${rama}`);
  console.log(`Rama ${rama} creada desde ${it} y subida a GitHub.`);
}
console.log(`Recuerda: los commits de esta historia llevan el scope ${it.replace('-', '')}h${num}`);
