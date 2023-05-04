const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, file) => {
  if(err) throw err;
  file.forEach(item => {
    fs.stat(path.resolve(secretFolder, item), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(`${path.parse(item).name} - ${path.extname(item).slice(1)} - ${stats.size / 1024}kb`)
      }
    });
  });
});