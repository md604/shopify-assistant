//const child_process = require("child_process");
//child_process.execSync(`zip -j ./zips/${process.env.npm_package_version}.zip ./dist/*`, {stdio: 'inherit'});

const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const directoryPath = path.resolve('dist');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    const zip = new AdmZip();
    let zipName: string = 'no_version';

    files.forEach(function (file) {
        if (file == 'manifest.json') {            
            const manifestData = fs.readFileSync(path.join('./dist/',file));
            const manifestJSON = JSON.parse(manifestData);
            zipName = manifestJSON.version;
        }
        zip.addLocalFile(path.join('./dist/',file));
    });
    zip.writeZip(path.join('./zips/',`v${zipName}.zip`));
});

export {};