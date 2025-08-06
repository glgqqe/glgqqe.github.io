const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'files');
const outputFile = path.resolve(baseDir, 'tree.json');

function walkDir(dir, base) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let tree = {};

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(base, fullPath);

    if (entry.isDirectory()) {
      tree[entry.name] = walkDir(fullPath, base);
    } else if (entry.isFile()) {
      tree[entry.name] = null; // файл — null
    }
  });

  return tree;
}

const tree = walkDir(baseDir, baseDir);

fs.writeFileSync(outputFile, JSON.stringify(tree, null, 2));
console.log('tree.json создан в', outputFile);
