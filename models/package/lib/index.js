'use strict';

const { isObject } = require('@imooc-cli-dev/utils');

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
    install(){}

    // 更新package
    update(){}
}

module.exports = Package