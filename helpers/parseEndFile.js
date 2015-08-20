'use strict';

var proportions = require('../config').proportions,
  fs = require('fs'),
  path = require('path');

function parseFile (src) {
  return src
    .match(/(\.icon-.+(?:\n.+)+\})/gm)
    .map(function (rule) {
      var ruleParts = getRuleParts(rule);
      return mergeRuleOutput(ruleParts);
    })
    .join('\n');
}

function getProportionsString (iconName) {
  var proportionsForIcon = proportions[iconName];
  return 'width:'
    + proportionsForIcon.width
    + "; height:"
    + proportionsForIcon.height
    + ";";
}

function getRuleParts (rule) {
  var simplified = rule.replace(/::before,\n\.bt-ico.+\{/, ' {');
  var iconName = simplified.match(/\.(icon-.+?) /)[1];
  var proportionsString = getProportionsString(iconName);
  var content = simplified.match(/\{(.+)\}/)[1];
  return {
    iconName: iconName,
    content: content,
    proportionsString: proportionsString,
    mergedContent: "{&::before{" + content + proportionsString + "}}"
  }
}

function mergeRuleOutput (ruleParts) {
  return "." + ruleParts.iconName + ruleParts.mergedContent
    + "\n"
    + "@mixin " + ruleParts.iconName + ruleParts.mergedContent;
}

module.exports = parseFile;