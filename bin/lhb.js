#!/usr/bin/env node
const program = require('commander');
const { version } = require('../package.json');
const create = require('../lib/create/index');

program
  .version(version, '-v, --version')//输入大写-V比较烦，就改成小写
  .usage('<command>')

// create指令劫持
create(program);

program.parse(process.argv);

