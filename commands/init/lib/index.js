'use strict';

const Command = require('@imooc-cli-dev/command');
const log = require('@imooc-cli-dev/log');

class InitCommand extends Command{
  init(){
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  exec(){
    console.log(1111111111)
  }
}

function init(argv) {
    return new InitCommand(argv);
  }

module.exports = init;
module.exports.InitCommand = InitCommand;
