#! /usr/bin/env node

'use strict';

const superagent = require('superagent');
const Table = require('cli-table2');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const l = console.log;
const w = console.warn;
const promiseItem = Promise.resolve;

let tablePrinter = new Table({
    head: ['索引', '匹配到的包', '当前的版本号', '要升级到的版本号', '处理'],
    colWidths: [20, 30, 20, 20, 20]
});

function std (code, str) {
    l(str || 'gg');
    process.exit(code);
};

function handlerAllFile( c, k ) {
    let allPathAarray = [];
    let re = new RegExp(k, 'i');

    new Promise((resolve, reject) => {
         fs.readdir( c, (err, files) => {
            if( err ) {
                std(1);
                reject(err);
            }
            files.forEach( _ => {
                if( re.test(_) ) {
                    allPathAarray.push( _ );
                }
            });
            resolve( allPathAarray );
        });
    }).then( data => {
        console.log(data);
    }).catch( err => {
        std(1);
    });
};

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
                             },
                             'c': {
                                 alias: 'ced',
                                 description: '包含所有项目的目录绝对路径',
                                 demand: true,
                                 default: '/Users/qsm/Code',
                                 type: 'string' 
                             },
                             'v': {
                                 description: '需要升级到的版本号',
                                 demand: true,
                                 type: 'string'
                             }
                        });
                    },
                    argv => {                   //handler  接受命令行参数
                        // console.log(argv.k);
                        // console.log(argv.p);
                        // console.log(argv.c);
                        // console.log(argv.v);
                        handlerAllFile( argv.c, argv.k );
                        // console.log(process.cwd());  //命令路径
                        // process.exit(1);   //失败
                        // process.exit(0);   //成功
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
