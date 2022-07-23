'use strict';

const path = require('path')
const Package = require('@imooc-cli-dev/package')
const log = require('@imooc-cli-dev/log');
const { exec:spawn } = require('@imooc-cli-dev/utils');
const Command = require('../../../commands/init/node_modules/@imooc-cli-dev/command/lib');

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
            storeDir,
            packageName,
            packageVersion
        })
        if(await pkg.exists()){
            // 更新package
            await pkg.update();
        }else{
            // 安装package
            await pkg.install()
        }
    }else {
        pkg = new Package({
          targetPath,
          packageName,
          packageVersion,
        });
    }
    const rootFile = pkg.getRootFilePath()
    if(rootFile){
       try{
        //require(rootFile).call(null, Array.from(arguments))
        const args = Array.from(arguments);
        const cmd = args[args.length - 1];
        const o = Object.create(null);
        Object.keys(cmd).forEach(key => {
          if (cmd.hasOwnProperty(key) &&
            !key.startsWith('_') &&
            key !== 'parent') {
            o[key] = cmd[key];
          }
        });
        args[args.length - 1] = o;
        const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`;
        const child = spawn('node',['-e', code],{
            cwd: process.cwd(),
            stdio: 'inherit'
        })
        child.on('error', e => {
            log.error(e.message);
            process.exit(1);
        });
        child.on('exit', e => {
            log.verbose('命令执行成功:' + e);
            process.exit(e);
          });
       }catch(e){
           log.error(e.message);
       }
    }
}



module.exports = exec;
