'use strict';

const { isObject } = require('@imooc-cli-dev/utils');
const pkgDir = require('pkg-dir').sync;
const path = require('path')
const formatPath = require('@imooc-cli-dev/format-path');
const npminstall = require('npminstall')
const { getDefaultRegistry, getNpmLatestVersion } = require('@imooc-cli-dev/get-npm-info');

class Package {
    constructor(options){
        if (!options) {
            throw new Error('Package类的options参数不能为空！');
          }
          if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象！');
          }
        // package的目标路径
        this.targetPath = options.targetPath;
        // 缓存package的路径
        this.storeDir = options.storeDir;
        // package的name
        this.packageName = options.packageName;
        // package的version
        this.packageVersion = options.packageVersion;
    }

    // 判断当前package是否存在
    exists(){}

    // 安装package
    install(){
      return npminstall({
          root: this.targetPath,
          storeDir: this.storeDir,
          registry: getDefaultRegistry(),
          pakgs: {
            name: this.packageName, version: this.packageVersion
          }
        })
    }

    // 更新package
    update(){}

    // 获取入口文件的路径
  getRootFilePath() {
    const dir = pkgDir(this.targetPath)
    if(dir){
      const pkgFile = require(path.resolve(dir,'package.json'))
      if(pkgFile && (pkgFile.main)){
        return formatPath(path.resolve(dir, pkgFile.main))
      }
    }
    return null
  }
}

module.exports = Package