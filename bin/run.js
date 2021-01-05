#!/usr/bin/env node

// console.log("scd-cli is run!");
// console.log("scd-cli changes optionally");

const program = require("commander");
program
  // 使用说明
  .usage("<command> [项目名称]")
  // 指定版本
  .version("1.0.0", "-v, --version")
  // 创建命令
  // .command('init')命令会找到同文件夹的xxx-init.js并执行
  .command("init", "初始化项目")
  // 解析命令行
  // parse这句很重要，最后都要加这句
  .parse(process.argv);
