'use strict';

const path = require('path')
const Package = require('@imooc-cli-dev/package')
const log = require('@imooc-cli-dev/log');

const SETTINGS = {
    init: '@imooc-cli/init',
};
  
const CACHE_DIR = 'dependencies'

async function exec() {
    // TODO
    const cmdObj = arguments[arguments.length-1];
    const cmdName = cmdObj.name()
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    let storeDir = '';
    let pkg;

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules');
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        })
        if(pkg.exists()){

        }else{
            await pkg.install()
        }
        const rootFile = pkg.getRootFilePath()
        if(rootFile){
            require(rootFile).apply(null, arguments)
        }
    }
}

module.exports = exec;
