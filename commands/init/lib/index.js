'use strict';

const Command = require('@imooc-cli-dev/command');
const log = require('@imooc-cli-dev/log');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const semver = require('semver');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command{
  init(){
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec(){
    try {
      this.prepare()
    }catch(e){
      log.error(e.message)
    }
  }
  async prepare(){
    const localPath = process.cwd()
    if(!this.isCwdEmpty(localPath)){
      let ifContinue  = false;
      if(!this.force){
        ifContinue  = (await inquirer.prompt({
          type: 'confirm',
          name: 'ifContinue',
          default: false,
          message: '当前文件夹不为空，是否继续创建项目？'
        })).ifContinue
        if (!ifContinue) {
          return;
        }
      }
      // 2. 是否启动强制更新
      if (ifContinue || this.force) {
        // 给用户做二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认清空当前目录下的文件？',
        });
        if (confirmDelete) {
          // 清空当前目录
          fse.emptyDirSync(localPath);
        }
      }
    }
    return this.getProjectInfo();
  }

  async getProjectInfo() {
    function isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }

    let projectInfo = {};
    let isProjectNameValid = false;
    if (isValidName(this.projectName)) {
      isProjectNameValid = true;
      projectInfo.projectName = this.projectName;
    }
    // 1. 选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择初始化类型',
      default: TYPE_PROJECT,
      choices: [{
        name: '项目',
        value: TYPE_PROJECT,
      }, {
        name: '组件',
        value: TYPE_COMPONENT,
      }],
    });
    log.verbose('type', type);
    const title = type === TYPE_PROJECT ? '项目' : '组件';
    const projectNamePrompt = {
      type: 'input',
      name: 'projectName',
      message: `请输入${title}名称`,
      default: '',
      validate: function(v) {
        const done = this.async();
        setTimeout(function() {
          // 1.首字符必须为英文字符
          // 2.尾字符必须为英文或数字，不能为字符
          // 3.字符仅允许"-_"
          if (!isValidName(v)) {
            done(`请输入合法的${title}名称`);
            return;
          }
          done(null, true);
        }, 0);
      },
      filter: function(v) {
        return v;
      },
    };
    const projectPrompt = [];
    if (!isProjectNameValid) {
      projectPrompt.push(projectNamePrompt);
    }
    projectPrompt.push({
        type: 'input',
        name: 'projectVersion',
        message: `请输入${title}版本号`,
        default: '1.0.0',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!(!!semver.valid(v))) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function(v) {
          if (!!semver.valid(v)) {
            return semver.valid(v);
          } else {
            return v;
          }
        },
      });
    if (type === TYPE_PROJECT) {
      // 2. 获取项目的基本信息
      const project = await inquirer.prompt(projectPrompt);
      projectInfo = {
        ...projectInfo,
        type,
        ...project,
      };
    } else if (type === TYPE_COMPONENT) {
      const descriptionPrompt = {
        type: 'input',
        name: 'componentDescription',
        message: '请输入组件描述信息',
        default: '',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!v) {
              done('请输入组件描述信息');
              return;
            }
            done(null, true);
          }, 0);
        },
      };
      projectPrompt.push(descriptionPrompt);
      // 2. 获取组件的基本信息
      const component = await inquirer.prompt(projectPrompt);
      projectInfo = {
        ...projectInfo,
        type,
        ...component,
      };
      console.log(projectInfo)
    }
  }

  isCwdEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤的逻辑
    fileList = fileList.filter(file => (
      !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    ));
    return !fileList || fileList.length <= 0;
  }
}

function init(argv) {
    return new InitCommand(argv);
  }

module.exports = init;
module.exports.InitCommand = InitCommand;
