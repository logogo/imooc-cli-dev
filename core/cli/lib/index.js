'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const commander = require('commander');
const pkg = require('../package.json')
const log = require('@imooc-cli-dev/log')
const init = require('@imooc-cli-dev/init')
const exec = require('@imooc-cli-dev/exec');
const constant = require('./const')

const program = new commander.Command();
let args,config;


async function core() {
    // TODO
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        //checkInputArgs()
        checkEnv()
        await checkGlobalUpdate()
        registerCommand();
    } catch (e) {
        log.error(e.message)
    }
}

function registerCommand() {
    program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

     // 开启debug模式
    program.on('option:debug', function() {
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
        log.verbose('test')
    });


    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec)

    // 指定targetPath
    program.on('option:targetPath', function() {
       process.env.CLI_TARGET_PATH = program.targetPath;
    });

    // 对未知命令监听
    program.on('command:*', function(obj) {
        const availableCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red('未知的命令：' + obj[0]));
        if (availableCommands.length > 0) {
        console.log(colors.red('可用命令：' + availableCommands.join(',')));
        }
    });

    if (program.args && program.args.length < 1) {
        program.outputHelp();
        console.log();
    }

    program.parse(process.argv);
}

async function checkGlobalUpdate() {
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const { getNpmSemverVersion } = require('@imooc-cli-dev/get-npm-info');
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
      log.warn(colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
                  更新命令： npm install -g ${npmName}`));
    }
  }
  

function checkEnv(){
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome,'env')
    if(pathExists(dotenvPath)){
        config = dotenv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
}

function createDefaultConfig(){
    const cliConfig = {
        home: userHome
    };
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome,process.env.CLI_home)
    }else{
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgs(){
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs()
}

function checkArgs(){
    if(args.debugger){
        process.env.LOG_LEVEL = 'verbose';
    }else{
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL
}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}


function checkRoot(){
    const rootCheck = require('root-check')
    rootCheck()
}

function checkNodeVersion(){
    // 第一步 获取当前版本号
    const currentVersion = process.version
    // 第二步 对比最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if(!semver.gte(currentVersion,lowestVersion)){
        throw new Error(colors.red(`imooc-cli 需要安装 v${lowestVersion}以上版本的Node.js`))
    }
}

function checkPkgVersion(){ // 检查版本好
    log.notice('cli', pkg.version)
}

