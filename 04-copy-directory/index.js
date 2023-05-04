const fsPromise = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

function copyDir() {
  fsPromise.rm(folderCopy, { recursive: true, force: true }, () => { }).then( () => {
    fsPromise.mkdir(folderCopy, { recursive: true }, () => { });
    fsPromise.readdir(folder, { withFileTypes: true }, () => { }).then( items => {
      items.forEach( item => {
        fsPromise.copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name));
    });
  });
});
}

copyDir();