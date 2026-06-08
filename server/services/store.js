const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../../data/memory.json');

function load() {
  if (!fs.existsSync(STORE_PATH)) return [];
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

function save(data) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

function getAll() { return load(); }

function append(item) {
  const store = load();
  store.push(item);
  save(store);
}

function filter(fn) { return load().filter(fn); }

module.exports = { getAll, append, filter };
