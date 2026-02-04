const fs = require('fs');
const path = 'D:/APP/创意app/YW-v9.0/components/FlyingChess.tsx';
let s = fs.readFileSync(path, 'utf8');
if (!s.includes('customPunishments')) {
  s = s.replace(
    'interface FlyingChessProps {\n  settings: GameSettings;\n  leader: Gender;\n}',
    'interface FlyingChessProps {\n  settings: GameSettings;\n  leader: Gender;\n  customPunishments?: { discipline: string[]; chance: string[]; fate: string[] };\n}'
  );
  s = s.replace(
    'const FlyingChess: React.FC<FlyingChessProps> = ({ settings, leader }) => {',
    'const FlyingChess: React.FC<FlyingChessProps> = ({ settings, leader, customPunishments }) => {'
  );
  if (!s.includes('const pickRandom')) {
    s = s.replace('  const gridSize = 24;\n', '  const gridSize = 24;\n\n  const pickRandom = (list: string[]) => list[Math.floor(Math.random() * list.length)];\n');
  }
  s = s.replace(
    "    if (type === 'CHANCE') return { title: '瀵嗚瘡', desc: settings.chanceCards[Math.floor(Math.random() * settings.chanceCards.length)] };",
    "    if (type === 'CHANCE') {\n      const custom = customPunishments?.chance;\n      return { title: '瀵嗚瘡', desc: custom && custom.length ? pickRandom(custom) : settings.chanceCards[Math.floor(Math.random() * settings.chanceCards.length)] };\n    }"
  );
  s = s.replace(
    "    if (type === 'FATE') return { title: '濂戠害', desc: settings.fateCards[Math.floor(Math.random() * settings.fateCards.length)] };",
    "    if (type === 'FATE') {\n      const custom = customPunishments?.fate;\n      return { title: '濂戠害', desc: custom && custom.length ? pickRandom(custom) : settings.fateCards[Math.floor(Math.random() * settings.fateCards.length)] };\n    }"
  );
  s = s.replace(
    "    const taskType = type === 'PLEASURE' ? 'PLEASURE' : 'DISCIPLINE';\n    const tasks = pool[taskType][actor];",
    "    const taskType = type === 'PLEASURE' ? 'PLEASURE' : 'DISCIPLINE';\n    const customDiscipline = customPunishments?.discipline;\n    const tasks = taskType === 'DISCIPLINE' && customDiscipline && customDiscipline.length ? customDiscipline : pool[taskType][actor];"
  );
  s = s.replace(/backdrop-blur-3xl/g, '');
}
fs.writeFileSync(path, s, 'utf8');
