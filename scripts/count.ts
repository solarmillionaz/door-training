import { cards as o } from '../src/data/objections';
import { cards as s } from '../src/data/smokescreens';
import { cards as c } from '../src/data/concerns';
import { rejected } from '../src/data/gen';
for (const [n, l] of [['objections', o], ['smokescreens', s], ['concerns', c]] as const) {
  const es = l.filter((x) => x.meaning.startsWith('Spanish:')).length;
  console.log(n, l.length, 'spanish', es, (100 * es / l.length).toFixed(1) + '%');
}
console.log('rejected', rejected.length);
for (const r of rejected) console.log(`  [${r.category}] ${r.line}  ~  ${r.like}`);
