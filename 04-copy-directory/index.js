const fsPromise = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

async function copyDir() {
  fsPromise.rm(folderCopy, {recursive: true, force: true})
    .then( () => { 
      fsPromise.mkdir(folderCopy, { recursive: true })
    })
    .then ( () => {
      return fsPromise.readdir(folder, { withFileTypes: true })
    })
    .then ( (items) => {
      items.forEach( item => {
        fsPromise.copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name));
      });
    })
    .catch(error => console.log(error.message))
}

copyDir();