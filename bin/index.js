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

let rootPath = '';  //根目录
let updatePackgeName = '';  //需要升级的包名字
let updateVersion = '';  //将要升级的版本号
let tablePrinter = null;
let allFileArray = {}; 

function std (code, str) {
    l(str || 'gg');
    process.exit(code);
};

//处理IO
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
        var allpipie = [];

        data.map( (o, i) => {
            if( handlerPackage( o ) ) {
                allFileArray[i] = [ i, o, '', updateVersion ];
                tablePrinter.push( [i ,o, '', updateVersion ] );
                allpipie.push(handlerPackage( o ));
            }
        });
        Promise.all(allpipie)
            .then(data => {
                data.map((o, i) => {
                    allFileArray[i][2] = o;
                    tablePrinter[i][2] = o;
                    tablePrinter[i][4] = (function (v1, v2) {
                        var str = '';
                        var result = compareVersion( v1, v2 );
                        if( result === 1 || result === 0) {
                            str = '不处理';
                        }else if( result === -1 ) {
                            str = '升级';
                        }
                        return str;
                    })( allFileArray[i][2].substring(1), allFileArray[i][3] );
                });
                // console.log(allFileArray);
                console.log(tablePrinter.toString());
            });
    }).catch( err => {
        std(1, err);
    });
};

//读取版本号  返回promise
function handlerPackage ( p ) {
    let packJSONFilePath = path.join( rootPath, p, 'package.json');
    let nowVersion = '';
    return new Promise((resolve, reject) => {
        fs.readFile( packJSONFilePath, 'utf-8', (err, data) => {
            if( err ) {
                std(1);
                reject(err);
            }
            var translateData = JSON.parse( data );
            nowVersion = translateData.dependencies[updatePackgeName] || translateData.devDependencies[updatePackgeName] || ''; 
            resolve(nowVersion);
        });
    });
};
//比较版本号  1 : v1 > v2 -1 : v1 < v2 0: v1 === v2 
function compareVersion (v1, v2) {
    //补充占位符  因为版本号的特性 不是很好比较 如果每个位置都是三位数字的话 就比较好比较了
    let supplementItem = ['', '0', '00', '000'];
        v1 = v1.split('.').map( _ => {
            return _ + supplementItem[3 - _.length]; 
        }),
        v2 = v2.split('.').map( _ => {
            return _ + supplementItem[3 - _.length]; 
        });
    let max = v1.length > v2.length ? v1 : v2;
    let diff = 0;
    for( var i = 0; i < max.length; i++ ) {
        diff = v1[i] - v2[i]
        if( diff !== 0 ) {
            break;
        }
    } 
    if( diff > 0 ) {
        return 1;
    }else if( diff < 0 ) {
        return -1;
    }else {
        return 0;
    }
}

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
                                 alias: 'cwd',
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
                        rootPath = argv.c;
                        updatePackgeName = argv.p;
                        updateVersion = argv.v;
                        tablePrinter = new Table({
                            head: ['索引', '匹配到的项目', `当前${updatePackgeName}的版本号`, `${updatePackgeName}升级到的版本号`, '处理'],
                            colWidths: [8, 35, 20, 20, 20]
                        });
                        handlerAllFile( argv.c, argv.k );
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
