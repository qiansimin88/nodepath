#! /usr/bin/env node

'use strict';

const commander = require('commander');
const superagent = require('superagent');
const Table = require('cli-table2');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

let tablePrinter = new Table({
    head: ['索引', '匹配到的包'],
    colWidths: [20, 50]
});

commander
    .allowUnknownOption()
    .version('1.1.1')
    .usage('update some npm package 😄')
    .command('update [packagename]')
    .description('查询并且一键升级')
    .action((par) => {
        //项目的最外围的检索根目录
        var rootPath = path.join(__dirname, '../../');
        var allPathAarray = [];
        fs.readdir(rootPath, (err, files) => {
            files = files.filter(o => {
                if(/phoenix/i.test(o)) {
                    tablePrinter.push({
                        "项目名": o 
                    });
                }
            });
            console.log(tablePrinter.toString());
        });
    });


if(!process.argv[2]) {
    commander.help();
}

commander.parse(process.argv);
