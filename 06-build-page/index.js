const fsPromises = require('fs/promises');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const copyAssestsFolder = path.join(projectDist, 'assets')
const styles = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');

async function removeDirectory(name) {
  await fsPromises.rm(name, {recursive: true, force: true});
}

async function createDirectory(name) {
  await fsPromises.mkdir(name, { recursive: true })
}

async function copyAssets(input, output) {
  await createDirectory(output);
  await fsPromises.readdir(input, { withFileTypes: true, recursive: true}) 
  .then ( dir => {
    dir.forEach(async folder => {
    await createDirectory(path.join(output, folder.name))
    const file = await fsPromises.readdir(path.join(input, folder.name), { withFileTypes: true, recursive: true});
    file.forEach(item => {
      fsPromises.copyFile( path.join(input, folder.name, item.name), path.join(output, folder.name, item.name));
    });
   });
  });
};

async function bundleCSS () {
 await fsPromises.readdir(styles, { withFileTypes: true, recursive: true, encodnig: "utf8" })
  .then((data) => {
    return data.filter(item =>
      path.extname(item.name) === '.css' && item.isFile())
  })
  .then( (files) => {
    const ccsCode = files.map(async file => {
    const css = await fsPromises.readFile(path.join(styles, file.name), "utf-8");
    return css;
    })
    return Promise.all(ccsCode)
  })
  .then(async (bundle) => {
      await fsPromises.writeFile(path.join(projectDist, 'style.css'), bundle.join('\n'))
  })
  .catch(error => console.log(error.message))
}

async function bundleHTML() {
  await fsPromises.readdir(componentsDir, { withFileTypes: true, recursive: true, encoding: "utf-8"})
  .then( async (data) => {
    let tempFileRead = await fsPromises.readFile(template, "utf-8");
    const result = data.map(async file => {
      const patternExt = path.extname(file.name);
      if (patternExt === '.html' && file.isFile()) {
        const patternName = path.basename(file.name, path.extname(file.name))
        let patternRead = await fsPromises.readFile(path.join(componentsDir, file.name));
        tempFileRead = tempFileRead.replace(new RegExp('{{' + patternName + '}}','g'), patternRead);
      }
      return tempFileRead;
    })
    return Promise.all(result)
  })
  .then( async value => {
   await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), value.pop(), "utf-8")
  })
  .catch(error => console.log(error.message));
}

async function init() {
  await removeDirectory(projectDist);
  await createDirectory(projectDist);
  await copyAssets(assets, copyAssestsFolder);
  await bundleCSS()
  await bundleHTML()
}

init()