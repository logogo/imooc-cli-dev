'use strict';

module.exports = core;

const semver = require('semver')
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const pkg = require('../package.json')
const log = require('@imooc-cli-dev/log')
const constant = require('./const')
let args;


function core() {
    // TODO
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        log.verbose('debug','test debugger log')
    } catch (e) {
        log.error(e.message)
    }
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

