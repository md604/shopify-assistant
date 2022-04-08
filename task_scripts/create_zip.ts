const child_process = require("child_process");
child_process.execSync(`zip -j ./zips/${process.env.npm_package_version}.zip ./dist/*`, {stdio: 'inherit'});
export {};