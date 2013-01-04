var libs = {};
libs.fs = require('fs');
libs.yaml = require('yaml');
var $ = require('jquery');

if (!libs.fs.isReadable('config.yaml')) {
  console.log("unable to read config.yaml");
  phantom.exit();
}
var providedConfig = libs.yaml.eval(libs.fs.open('config.yaml', 'r').read());
if (providedConfig instanceof Object == false) {
  console.log("config.yaml not a yaml file?");
  phantom.exit();
}

var defaults = {
  login_url: 'https://www.myiclubonline.com/iclub/members'
}

phantom.exit();
