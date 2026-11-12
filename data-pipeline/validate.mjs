import Ajv from 'ajv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const recordsPath = join(here, '..', 'src', 'data', 'robotRecords.json');
const schema = JSON.parse(await readFile(join(here, 'schema', 'robot.schema.json'), 'utf8'));
const records = JSON.parse(await readFile(recordsPath, 'utf8'));
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
const ids = new Map();
let failures = 0;
const quoteClaim = /\b(?:said|says|told|message|quote|wrote|words)\b/i;
const quotedWords = /(?:"[^"]{2,}"|“[^”]{2,}”|'[^']{2,}'|‘[^’]{2,}’)/;

if (!Array.isArray(records) || records.length === 0) {
  console.error('src/data/robotRecords.json must contain a non-empty array of records.');
  process.exit(1);
}

for (const record of records) {
  const label = record?.id ?? 'missing id';
  const errors = [];
  if (!validate(record)) {
    for (const error of validate.errors ?? []) errors.push(`${error.instancePath || '/'} ${error.message}`);
  }
  if (typeof record?.id === 'string') {
    const previous = ids.get(record.id);
    if (previous) errors.push(`/id duplicate id also used by record ${previous}`);
    else ids.set(record.id, ids.size + 1);
  }
  const urls = Array.isArray(record?.sources) ? record.sources : [];
  const httpsUrls = urls.filter(url => typeof url === 'string' && /^https:\/\//.test(url));
  if (!httpsUrls.length) errors.push('/sources at least one HTTPS source URL is required');
  const sourceHosts = httpsUrls.flatMap(url => {
    try { return [new URL(url).hostname.toLowerCase()]; } catch { return []; }
  });
  if (record?.agency === 'NASA' && !sourceHosts.some(host => host === 'nasa.gov' || host.endsWith('.nasa.gov'))) {
    errors.push('/sources NASA records need at least one source hosted on nasa.gov');
  }
  if (record?.agency && record.agency !== 'NASA') {
    const agencyToken = record.agency.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!sourceHosts.some(host => host.replace(/[^a-z0-9]/g, '').includes(agencyToken))) {
      errors.push(`/sources non-NASA agency "${record.agency}" needs a source URL from that agency`);
    }
  }
  if (Array.isArray(record?.quiz)) record.quiz.forEach((item, index) => {
    if (!Array.isArray(item?.options) || item.options.length < 2) errors.push(`/quiz/${index}/options must contain at least 2 options`);
  });
  if (Array.isArray(record?.story)) record.story.forEach((page, index) => {
    if (typeof page?.text === 'string' && quoteClaim.test(page.text) && quotedWords.test(page.text) && page.poetic !== true) {
      errors.push(`/story/${index}/poetic quoted or attributed words need poetic: true`);
    }
  });
  if (errors.length) {
    console.error(`FAIL ${label}`);
    for (const error of [...new Set(errors)]) console.error(`  - ${error}`);
    failures++;
  } else {
    console.log(`PASS ${label}`);
  }
}

if (failures) {
  console.error(`\nValidation failed: ${failures} record(s) have errors.`);
  process.exit(1);
}
console.log(`\nValidated ${records.length} robot record(s) from ${recordsPath}.`);
