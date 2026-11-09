import { cards as o } from '../src/data/objections';
import { cards as s } from '../src/data/smokescreens';
import { cards as c } from '../src/data/concerns';
let seed = 20261108; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (const [n, l] of [['OBJECTIONS', o], ['SMOKESCREENS', s], ['CONCERNS', c]] as const) {
  const pool = [...l]; const out = [];
  while (out.length < 20) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  console.log(`\n${n} (${l.length})`);
  out.forEach((x) => console.log(`- ${x.statement}${x.meaning.startsWith('Spanish:') ? '  ' + x.meaning.split('. ')[0] : ''}  [${x.classification}]`));
}
