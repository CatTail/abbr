#!/usr/bin/env node

/**
 * Module dependencies.
 */

var colors = require('colors');
var wiki = require('wiki-dict');
var open = require('open');
var program = require('commander');

var fuzzySearch = function (name, dict) {
  var initial;
  for (initial in dict) {
    dict[initial].forEach(function(tuple) {
      if (tuple.name.toLowerCase().indexOf(name) !== -1) {
        console.log(tuple.name.green);
        tuple.abbrs.forEach(function(abbr) {
          console.log('  ' + abbr.grey);
        });
      }
    });
  }
};

var exactSearch = function (name, dict) {
  var abbrs;
  // exact search
  initial = name[0].toUpperCase();
  if (dict[initial]) {
    dict[initial].some(function(tuple) {
      if (tuple.name.toLowerCase() === name) {
        abbrs = tuple.abbrs;
      }
      return true;
    });
  }
  if (abbrs) {
    console.log(name.green);
    abbrs.forEach(function(abbr) {
      console.log('  ' + abbr.grey);
    });
  } else {
    console.log('Don\'t find abbreviation match '.red + name.green);
  }
};

var search = function(name, options) {
  wiki('https://github.com/CatTail/abbr/wiki/Dictionary', function(err, dict){
    if (err) throw err;
    name = name.toLowerCase();
    (options.exact ? exactSearch : fuzzySearch)(name, dict);
  });
};


var create = function () {
  open('https://github.com/CatTail/abbr/wiki/Dictionary/_edit');
};


/* 
 * CLI
 */

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('search <name>')
  .description('Search for name abbreviation')
  .option('-E --exact', 'Exact match for variable name')
  .action(search);

program
  .command('create')
  .description('Create a new abbreviation')
  .action(create);

program.parse(process.argv);

if (!program.args[0]) program.help();
