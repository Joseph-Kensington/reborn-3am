import { script } from '../src/data/script';
import { validateScript } from '../src/engine/validateScript';

const errors = validateScript(script);
if (errors.length > 0) {
  console.error('剧本校验失败：');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`剧本校验通过：${Object.keys(script).length} 个节点`);
