'use strict';

const Package = require('@imooc-cli-dev/package')
const log = require('@imooc-cli-dev/log');

const SETTINGS = {
    init: '@imooc-cli/init',
};
  

function exec() {
    // TODO
    const cmdObj = arguments[arguments.length-1];
    const cmdName = cmdObj.name()
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    const pkg = new Package({
        targetPath,
        packageName,
        packageVersion
    })
    console.log(pkg)
}

module.exports = exec;
