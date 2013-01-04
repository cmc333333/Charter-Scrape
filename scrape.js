phantom.injectJs('waitfor.js');
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
  //  Wait for the page to load
  waitfor(1000).then(function() {
    //  Log in
    page.evaluate(function(config) {
      $('#loginform input[type=text]').val(config.username);
      $('#loginform input[type=password]').val(config.password);
      $('#loginform').submit();
    }, config);
    //  Wait for the new page to load
    waitfor(3000).then(function() {
      //  Open the checkin history
      page.evaluate(function() {
        window.location.hash = '#account/checkinhistory'
      }),
      waitfor(1000).then(function() {
        page.render('example.png');
        phantom.exit();
      });
    });
  });
});

