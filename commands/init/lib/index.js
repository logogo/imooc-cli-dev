'use strict';

const Command = require('@imooc-cli-dev/command');

class InitCommand extends Command{

}

function init(argv) {
    return new InitCommand(argv);
  }

module.exports = init;
module.exports.InitCommand = InitCommand;
