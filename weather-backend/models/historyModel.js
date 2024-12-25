/**
 * historyModel.js
 * 
 * 读取/写入搜索记录到 JSON 文件 (history.json)
 */

const fs = require('fs');
const path = require('path');

const historyFilePath = path.join(__dirname, 'history.json');

async function loadHistory() {
  if (!fs.existsSync(historyFilePath)) {
    return [];
  }
  const data = fs.readFileSync(historyFilePath, 'utf-8');
  return JSON.parse(data);
}

async function saveSearch(record) {
  const history = await loadHistory();
  history.push(record);
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
}

module.exports = {
  loadHistory,
  saveSearch
};
