#! /usr/bin/env node

'use strict';

const superagent = require('superagent');
const Table = require('cli-table2');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

let tablePrinter = new Table({
    head: ['索引', '匹配到的包'],
    colWidths: [20, 50]
});

const yargs = require('yargs')
                .command(
                    'update',                       //命令CMD
                    'update some npm package',      //描述
                     yargs => {                     //builder
                         //输入匹配关键字
                        return yargs.option({    //对象
                            'k': {
                                alias: 'keyword',
                                description: '输入关键字来匹配项目',
                                demand: true,  //必选参数
                                default: 'phoenix', //该参数的默认值
                                type: 'string'   //参数类型
                             },
                             'p': {
                                alias: 'packageName',
                                description: '输入包名',
                                demand: true,  //必选参数
                                default: 'tm-c-oss', //该参数的默认值
                                type: 'string'   //参数类型
                             }
                        });
                    },
                    argv => {                   //handler  接受命令行参数
                        console.log(argv.k);
                        console.log(argv.p);
                        console.log(process.cwd());  //命令路径
                        process.exit(1);   //失败
                        process.exit(0);   //成功
                    }
                )
                .help('h')   //  输入 -h 显示帮助信息
                .usage('Usage: $0 <command> [options]')
                // .alias('n', 'name')   //别名
                // .array('n')   //参数是数组形式  
                .epilog('copyright qsm@shining3d')   //结尾文字
                .argv;

// yargs
//     .allowUnknownOption()
//     .version('1.1.1')
//     .usage('update some npm package 😄')
//     .command('update [packagename]')
//     .description('查询并且一键升级')
//     .action((par) => {
//         //项目的最外围的检索根目录
//         var rootPath = path.join(__dirname, '../../');
//         var allPathAarray = [];
//         fs.readdir(rootPath, (err, files) => {
//             files = files.filter(o => {
//                 if(/phoenix/i.test(o)) {
//                     tablePrinter.push({
//                         "项目名": o 
//                     });
//                 }
//             });
//             console.log(tablePrinter.toString());
//         });
//     });


// if(!process.argv[2]) {
//     yargs.help();
// }

// yargs.parse(process.argv);
