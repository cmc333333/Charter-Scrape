var fs = require('fs');
var yaml = require('yaml');
var $ = require('jquery');
var page = require('webpage').create();

if (!fs.isReadable('config.yaml')) {
  console.log('unable to read config.yaml');
  phantom.exit();
}
var providedConfig = yaml.eval(fs.open('config.yaml', 'r').read());
if (providedConfig instanceof Object == false) {
  console.log('config.yaml not a yaml file?');
  phantom.exit();
}

if (!('username' in providedConfig)) {
  console.log('missing username');
  phantom.exit();
}
if (!('password' in providedConfig)) {
  console.log('missing password');
  phantom.exit();
}

var config = {
  login_url: 'https://www.myiclubonline.com/iclub/members'
}

$.extend(config, providedConfig);

page.open(config.login_url, function() {
  //  Wait for the page to load, then take a picture
  window.setTimeout(function() {
    page.render('example.png');
    phantom.exit();
  }, 1000);
});

