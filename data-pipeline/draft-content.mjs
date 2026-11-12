import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const recordsPath = join(root, 'src', 'data', 'robotRecords.json');
const records = JSON.parse(await readFile(recordsPath, 'utf8'));
const longDate = value => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
const worldName = { moon: 'the Moon', mars: 'Mars', deep_space: 'deep space' };
const label = { left_behind: 'Left Behind', silent: 'Went Silent', still_talking: 'Still Talking' };
const sourceFor = record => record.sources.find(url => record.agency !== 'NASA' ? new URL(url).hostname.toLowerCase().includes(record.agency.toLowerCase()) : /(^|\.)nasa\.gov$/i.test(new URL(url).hostname)) ?? record.sources[0];
const safe = value => value.replace(/[\\/:*?"<>|]/g, '-');
const titleName = record => record.name;
const distractors = (right, list) => [...new Set(list.filter(value => value && value !== right))].slice(0, 3);
const q = (question, answer, other, explanation) => ({ q: question, options: [answer, ...distractors(answer, other)].slice(0, 4), explanation, draftBy: 'ai' });

const lastMessages = {};
for (const record of records) {
  const name = titleName(record);
  const body = worldName[record.world];
  const statusLabel = label[record.status];
  const source = sourceFor(record);
  const story = [
    { title: 'A journey begins', text: `${name} launched on ${longDate(record.launchDate)}. It reached ${body} on ${longDate(record.arrivalDate)}.` },
    { title: 'A job to do', text: `${record.kidFact} This was part of the mission's work in ${body}.` },
    { title: statusLabel, text: `${record.endReason} ${record.whyLeft}` },
  ];
  const lines = [
    { id: 'launch', text: `I began my journey on ${longDate(record.launchDate)}.`, poetic: true, source },
    { id: 'arrival', text: `I reached ${body} on ${longDate(record.arrivalDate)}.`, poetic: true, source },
    { id: 'work', text: record.kidFact, poetic: true, source },
    { id: 'ending', text: record.endReason, poetic: true, source },
    { id: 'left', text: record.whyLeft, poetic: true, source },
  ];
  if (record.id === 'opportunity-mer-b') {
    lines.push({ id: 'battery-human-interpretation', text: 'My battery is low, and it is getting dark.', poetic: true, source: record.sources.find(url => /opportunity|mer-opportunity/i.test(url)) ?? source });
  }
  record.story = story;
  record.lastMessage = lines.map(({ text, poetic }) => ({ text, poetic }));

  const dates = [longDate(record.launchDate), longDate(record.arrivalDate), record.endDate ? longDate(record.endDate) : 'No end date is recorded'];
  const statusOptions = ['Left Behind', 'Went Silent', 'Still Talking'];
  const worldOptions = ['the Moon', 'Mars', 'deep space'];
  record.quiz = [
    q(`When did ${name} launch?`, dates[0], [dates[1], dates[2], 'July 20, 1969'], `The record's launch date is ${dates[0]}.`),
    q(`When did ${name} reach ${body}?`, dates[1], [dates[0], dates[2], 'July 20, 1969'], `The record's arrival date is ${dates[1]}.`),
    q(`Where did ${name} explore or travel?`, body, worldOptions, `The record places this explorer in ${body}.`),
    q(`Which fact about ${name} is true?`, record.kidFact, [
      `It explored ${worldOptions.find(item => item !== body)}.`,
      'It returned to Earth after its mission.',
      'It carried people on every trip.',
    ], record.kidFact),
    q(`What happened to ${name}?`, record.endReason, [
      'It landed safely back on Earth.',
      'It was brought home for repairs.',
      'It never reached its destination.',
    ], record.endReason),
    q(`Why is ${name} still there or still travelling?`, record.whyLeft, [
      'A crew planned to pick it up on the next flight.',
      'It was sent back to Earth in a cargo ship.',
      'It was built to drive all the way home.',
    ], record.whyLeft),
    q(`Which status label fits ${name}?`, statusLabel, statusOptions, `The record marks this explorer as ${record.status}.`),
    q(`Which sentence matches the record for ${name}?`, record.kidFact, [
      `${name} has an end date of ${dates[2]}.`,
      `${name} travelled to ${worldOptions.find(item => item !== body)}.`,
      `${name} returned to Earth after exploring.`,
    ], `NASA's cited mission information supports this fact: ${record.kidFact}`),
  ];

  const firstMessage = `I launched on ${longDate(record.launchDate)} and reached ${body} on ${longDate(record.arrivalDate)}.`;
  lastMessages[record.id] = {
    lines,
    audio: { en: null, bn: null },
    credit: 'AI-drafted first-person retelling of cited mission facts; not a real transmission.',
    draftBy: 'ai',
  };

  const worksheet = `# ${name}\n\n**Explorer file — printable activity page**\n\n## Three fact boxes\n\n1. **Journey:** Launched ${longDate(record.launchDate)}; reached ${body} ${longDate(record.arrivalDate)}.\n2. **Mission fact:** ${record.kidFact}\n3. **What happened:** ${record.endReason} **Status:** ${statusLabel}.\n\n## Think it through\n\n1. What was ${name}'s job?\n2. Why is it still at its destination or travelling in space?\n3. Which fact would you tell a friend?\n\n## Draw and think\n\nDraw ${name} where it explored. Add one detail from the mission fact box. What question would you ask a scientist about this explorer?\n\n## Sources\n\n${record.sources.map(url => `- ${url}`).join('\n')}\n\n*Student activity. Check the linked NASA${record.agency === 'NASA' ? '' : ` and ${record.agency}`} sources for more details.*\n`;
  await mkdir(join(root, 'worksheets'), { recursive: true });
  await writeFile(join(root, 'worksheets', `${safe(record.id)}.md`), worksheet);
}

await writeFile(recordsPath, `${JSON.stringify(records, null, 2)}\n`);
await writeFile(join(root, 'src', 'data', 'lastMessages.json'), `${JSON.stringify(lastMessages, null, 2)}\n`);
const whyLeft = {
  sections: [
    {
      id: 'cost-of-return', icon: '🚀', title: 'Bringing things home takes another mission',
      text: 'A return trip needs more spacecraft, fuel, and careful planning. NASA’s Mars Sample Return plans show that bringing even small samples home takes a separate mission with many steps. That work can add cost and complexity.',
      sources: ['https://www.nasa.gov/news-release/nasa-sets-path-to-return-mars-samples-seeks-innovative-designs/'],
    },
    {
      id: 'protect-heritage', icon: '🪨', title: 'Some places are historic science sites',
      text: 'Apollo hardware and footprints help tell the story of exploration. NASA recommends protecting historic lunar artifacts so future visitors do not disturb their scientific and historic value.',
      sources: ['https://www.nasa.gov/wp-content/uploads/2017/10/617743main_nasa-usg_lunar_historic_sites_reva-508.pdf', 'https://www.nasa.gov/wp-content/uploads/static/history/humanartifacts.html'],
    },
    {
      id: 'space-preservation', icon: '🌌', title: 'Spacecraft need a safe end-of-mission plan',
      text: 'Spacecraft do not all end in the same way. NASA plans how to move spacecraft out of busy Earth orbits or into safe paths, helping protect future space missions. A Moon lander or a craft far beyond Earth has a different situation.',
      sources: ['https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8715_006E_&page_name=Chapter1', 'https://www.nasa.gov/reference/3-9-project-phase-f-closeout/'],
    },
  ],
};
await writeFile(join(root, 'src', 'data', 'whyLeft.json'), `${JSON.stringify(whyLeft, null, 2)}\n`);
console.log(`Drafted stories, messages, eight quizzes, and worksheets for ${records.length} records.`);
