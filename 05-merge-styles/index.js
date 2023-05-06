const fsPromises = require('fs/promises');
const path = require('path');
const styles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');

async function bundleCSS() {
  fsPromises.readdir(styles, { withFileTypes: true, recursive: true, encodnig: "utf8" })
  .then((data) => {
    return data.filter(item =>
      path.extname(item.name) === '.css' && item.isFile())
  })
  .then((files) => {
    const ccsCode = files.map(file => {
      return fsPromises.readFile(path.join(styles, file.name), "utf-8")
        .then((css) => {
          return css
        })
    })
    return Promise.all(ccsCode)
  })
  .then((bundle) => {
      fsPromises.writeFile(path.join(projectDist, 'bundle.css'), bundle.join('\n'))
  })
  .catch(error => console.log(error.message))
}

bundleCSS()