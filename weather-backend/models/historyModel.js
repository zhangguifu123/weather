const fs = require('fs').promises;
const path = require('path');

const historyFilePath = path.join(__dirname, 'history.json');

async function loadHistory() {
  try {
    const data = await fs.readFile(historyFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    } else {
      throw err;
    }
  }
}

async function saveSearch(record) {
  const history = await loadHistory();
  history.push(record);
  
  if (history.length > 5) {
    history.shift();
  }
  
  await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
}

module.exports = {
  loadHistory,
  saveSearch
};
