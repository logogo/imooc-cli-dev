'use strict';

const Command = require('@imooc-cli-dev/command');

class InitCommand extends Command{

}

function init() {
    return new InitCommand();
  }

module.exports = init;
module.exports.InitCommand = InitCommand;
