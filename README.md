日常前端开发中，经常见到各种cli，如一行命令帮你生成react项目模板的create-umi。编写合适的命令行工具也可以快速构建出适合自己项目的模板。

## 前言
node cli的本质其实就是执行node脚本。
先安装好node及npm: [Nodejs官网下载](https://nodejs.org/en/)
构建命令的基础需要一个执行文件scd.js及package.json配置文件。

### 初识命令行
一个命令行中可以由命令、参数和选项等组成，如：
```javascript
//create就是命令 app就是参数
create-umi app
//-l就是选项，还有-v,--version 
ls -l                   
```
## hello nodejs
创建一个命令行工具源码目录并进入该目录
```javascript
mkdir scd-cli
```
初始化package.json
```javascript
// package.json的name将作为发布到npm上的包名称
npm init
```
初始化执行文件scd.js
```javascript
// 在scd-cli文件夹下
mkdir bin
// 在bin文件夹下新建scd.js
touch scd.js
```
测试程序scd is run!
```javascript
// 在scd.js中写入
// #!/usr/bin/env node 表示使用node作为脚本的解释程序，node的路径通过env来查找
// 本来需要这样运行node ./scd.js，但是加上了这句后就可以直接./scd.js运行
#!/usr/bin/env node
console.log('scd is run!')
```
package.json中添加bin字段，增加命令scd
```javascript
"bin": {
    "scd": "bin/scd.js"
}
```
将该命令行工具安装到本地全局
```javascript
npm install . -g
```
命令行中输入scd，若正常打印scd is run!即表示测试通过
```javascript
scd
```
通过建立软链接，当修改scd.js时，执行scd.js运行结果也会有变化
```javascript
// 显示下面信息即链接成功
// /usr/local/bin/scd -> /usr/local/lib/node_modules/scd-cli/bin/scd.js
// /usr/local/lib/node_modules/scd-cli -> /Users/snow/program-files/my-study/node/scd-cli
npm link

// 修改scd.js 增加：
console.log('scd changes optionally')

// 再次执行命令scd，也会打印 scd changes optionally
```
## 安装依赖模块开发
用到的一些模块：
```javascript
npm install commander inquirer ora chalk --save
```
- commander: commander能够更好的解析命令行参数，使开发更简单
- inquirer: 命令行交互界面集合。可以提问，解析输入，校验回答等
- ora: 可以使终端输出更优雅，设置正在进行，成功或失败
- chalk: 可以对终端输出的文字设置一些颜色等样式

### commander基本使用
```javascript
require('commander')
	// 指定版本
  .version(require('../package').version)
   // 使用说明
  .usage('<command> [options]')
  // 创建命令
  // .command('init')命令会找到同文件夹的xxx-init.js并执行
  .command('init', 'generate a new project from a template')
  .command('list', 'list available official templates')
  .command('build', 'prototype a new project')
  // 解析命令行
  // parse这句很重要，最后都要加这句
  .parse(process.argv)
```
### inquirer基本使用
```javascript
var inquirer = require('inquirer');
inquirer
  .prompt([
    /* Pass your questions in here */
			{
                type: 'confirm',
                name: 'install',
                message: '是否安装依赖',
                default: true
            }
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
    // answers: {install: true/false}
  });
```
### ora基本使用
```javascript
const ora = require('ora');
spinner = ora('开始安装依赖...');
spinner.start();
....
spinner.succeed('初始化项目完成。')
spinner.stop();

//或者
const ora = require('ora');
ora().fail(err)
```

## 项目文件目录
该项目可以通过选择下载不同的项目模板，配置自己的 package.json，并且可以选择是否要进行安装依赖。
![项目文件目录](https://github.com/llyuan520/scd-cli.git)

- bin  // 这里放置一些命令文件，例如scd.js为入口文件，scd-init.js 为scd init命令
- lib  // 存放一些编写需要的公共方法
- config // 配置文件，一些配置项

### scd.js
```javascript
#!/usr/bin/env node

// console.log('scd is run!')

// console.log('scd changes optionally')

const program = require('commander');
program
.usage('<command> [项目名称]')
.version('1.0.3', '-v, --version')
// .command('init')命令会找到同文件夹的scd-init
.command('init', '初始化项目')
.parse(process.argv)
```

### scd-init.js
根据传入的项目名称及命令行中选择的模板进行模板下载。具体执行过程如下：
```javascript
userdeMacBook-Pro:scd-cli snow$ scd init app
开始创建...
? 请选择模板 plugins
⠹ 开始下载模板，模板地址： git@github.com:umijs/plugins.git:
✔ 模板下载完成，开始配置配置文件
? 请输入项目名称 app
? 请输入项目版本 1.0.0
? 请输入项目描述
? 是否安装依赖 Yes
✔ 初始化项目完成。
```
### scd.default.config.js
选择你想选择的模板
```javascript
module.exports = {
    templateUrls: {
        "umi3": "http://git.servingcloud.com:8080/fe-components/sc-app-template.git",
        "https": "https://github.com/umijs/plugins.git",
        "ssh": "git@github.com:umijs/plugins.git",
    }
}
```
## 发布npm包

### 注册账号

在 npm 官网 https://www.npmjs.org 申请一个账号

### 添加用户名到npm环境中
```
npm adduser --registry http://registry.npmjs.org
```
指定registry为npm。这主要是区分本机已经安装了其它仓库例如cnpm的情况。

### 发布node项目
- 发布的node项目需要有package.json.
- 进入到npm项目，我的项目为scd-cli。执行命令: npm publish 也可以执行 npm publish --registry http://registry.npmjs.org 确保发往npm仓库

### 测试
1. 进入到 https://www.npmjs.com/~liuliyuan 查看是否有包
![scd-cli](https://github.com/llyuan520/scd-cli.git)
2.  在任意目录下执行 npm 
npm install scd-cli -g
执行scd init app 看是否成功

### 版本更新
如果项目目录有所修改，则需要修改package.json中的version，修改之后再次执行 npm publish。

-----
参考：

https://blog.csdn.net/haokur/article/details/81460973
https://blog.csdn.net/wyc_cs/article/details/51568941
https://www.npmjs.com/package/commander
https://www.npmjs.com/package/inquirer


