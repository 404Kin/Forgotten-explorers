import Ajv from 'ajv';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const recordsDir = join(here, 'records');
const schema = JSON.parse(await readFile(join(here, 'schema', 'robot.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false });
ajv.addFormat('date', value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
});
ajv.addFormat('uri', value => {
  try { return new URL(value).protocol.length > 0; } catch { return false; }
});
const validate = ajv.compile(schema);
const files = (await readdir(recordsDir)).filter(name => name.endsWith('.json')).sort();
const ids = new Map();
let failures = 0;
const quoteClaim = /\b(?:said|says|told|message|quote|wrote|words)\b/i;
const quotedWords = /(?:"[^"]{2,}"|“[^”]{2,}”|'[^']{2,}'|‘[^’]{2,}’)/;

if (!files.length) {
  console.error(`No JSON records found in ${recordsDir}`);
  process.exit(1);
}

for (const file of files) {
  const path = join(recordsDir, file);
  let record;
  try {
    record = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    console.error(`${file}: invalid JSON: ${error.message}`);
    failures++;
    continue;
  }
  const errors = [];
  if (!validate(record)) {
    for (const error of validate.errors ?? []) errors.push(`${error.instancePath || '/'} ${error.message}`);
  }
  if (typeof record.id === 'string') {
    const previous = ids.get(record.id);
    if (previous) errors.push(`/id duplicate id also used by ${previous}`);
    else ids.set(record.id, file);
  }
  if (!Array.isArray(record.sources) || record.sources.length === 0 || !record.sources.some(url => typeof url === 'string' && /^https:\/\//.test(url))) {
    errors.push('/sources at least one HTTPS source URL is required');
  }
  const sourceHosts = Array.isArray(record.sources) ? record.sources.flatMap(url => {
    try { return [new URL(url).hostname.toLowerCase()]; } catch { return []; }
  }) : [];
  if (record.agency === 'NASA' && !sourceHosts.some(host => host === 'nasa.gov' || host.endsWith('.nasa.gov'))) {
    errors.push('/sources NASA records need at least one source hosted on nasa.gov');
  }
  if (record.agency && record.agency !== 'NASA') {
    const agencyToken = record.agency.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hasAgencySource = sourceHosts.some(host => host.replace(/[^a-z0-9]/g, '').includes(agencyToken));
    if (!hasAgencySource) errors.push(`/sources non-NASA agency "${record.agency}" needs a source URL from that agency`);
  }
  if (Array.isArray(record.quiz)) record.quiz.forEach((item, index) => {
    if (!Array.isArray(item?.options) || item.options.length < 2) errors.push(`/quiz/${index}/options must contain at least 2 options`);
  });
  if (Array.isArray(record.story)) record.story.forEach((page, index) => {
    if (typeof page?.text === 'string' && quoteClaim.test(page.text) && quotedWords.test(page.text) && page.poetic !== true) {
      errors.push(`/story/${index}/poetic quoted or attributed words need poetic: true`);
    }
  });
  if (errors.length) {
    console.error(`FAIL ${file} (${record.id ?? 'missing id'})`);
    for (const error of [...new Set(errors)]) console.error(`  - ${error}`);
    failures++;
  } else {
    console.log(`PASS ${file} (${record.id})`);
  }
}

if (failures) {
  console.error(`\nValidation failed: ${failures} record(s) have errors.`);
  process.exit(1);
}
console.log(`\nValidated ${files.length} record(s).`);
