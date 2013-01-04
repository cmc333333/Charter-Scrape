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
        page.evaluate(function() {
          var lowMs = new Date().getTime();
          lowMs = lowMs - 90 * 1000*60*60*24; //  UI only allows 90 days
          var low = new Date(lowMs);
          $('input.lowDate').val(
            (low.getMonth()+1) + '/' + low.getDate() + '/' + low.getFullYear()
          );
          $('button.showButton').click();
        });
        waitfor(3000).then(function() {
          var data = page.evaluate(function() {
            var trs = $('#checkinhistory table tbody tr');
            return $.map(trs, function(tr) {
              var dateStr = $(tr.children[0]).text();
              var timeStr = $(tr.children[1]).text();
              var loc = $(tr.children[2]).text();
              var date = Date.parse(dateStr + ' ' + timeStr);
              return [date, loc];
            });
          });
          console.log(data);
          page.render('example.png');
          phantom.exit();
        });
      });
    });
  });
});

