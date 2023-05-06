const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

async function infomation() {
  fsPromises.readdir(secretFolder, { withFileTypes: true, recursive: true, encodnig: "utf8" })
  .then((data) => {
    return data.filter(item => item.isFile())
  })
  .then((files) => {
    return files.forEach( file => {
      fsPromises.stat(path.join(secretFolder, file.name), "utf-8")
        .then((stat) => {
          console.log(path.basename(file.name, path.extname(file.name)) + ' -',
          path.extname(file.name) + " -",
          stat.size / 1024 + "kb")
        })
        .catch(error => console.log(error.message))
    })
  })
  .catch(error => console.log(error.message))
}

infomation()