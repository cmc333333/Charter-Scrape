phantom.injectJs('waitfor.js');
var fs = require('fs');
var csv = require('a-csv');
var page = require('webpage').create();
var system = require('system');
var yaml = require('yaml');
var $ = require('jquery');

var configFileName = 'config.yaml';
if (system.args.length > 1) {
  configFileName = system.args[1];
}

//  First try to read in the config -- throw any errors that arise
if (!fs.isReadable(configFileName)) {
  console.log('unable to read ' + configFileName);
  phantom.exit();
}
var providedConfig = yaml.eval(fs.open(configFileName, 'r').read());
if (providedConfig instanceof Object == false) {
  console.log(configFileName + ' not a yaml file?');
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

//  Default configurations can be overwritten
var config = {
  login_url: 'https://www.myiclubonline.com/iclub/members'
}
$.extend(config, providedConfig);

//  Now we define what we'll do with the data we get back
function writeCSV(data) {
  var toWrite = '';
  $.each(data, function(index) {
    var date = this[0];
    //  unix time, iso time, location
    var row = [date.getTime(), date.toISOString(), this[1]];
    toWrite = toWrite + csv.stringify(row);
  });
  console.log(toWrite);
}


//  Let's kick it off by loading the page
page.open(config.login_url, function() {
  //  Wait for the login page to load
  waitfor(1000).then(function() {
    //  Log in
    page.evaluate(function(config) {
      $('#loginform input[type=text]').val(config.username);
      $('#loginform input[type=password]').val(config.password);
      $('#loginform').submit();
    }, config);
    //  Wait for the home page to load
    waitfor(3000).then(function() {
      //  Open the checkin history
      page.evaluate(function() {
        window.location.hash = '#account/checkinhistory'
      }),
      //  Wait to see checkin history
      waitfor(1000).then(function() {
        page.evaluate(function() {
          //  Try to get more data by moving the time frame as far back as we
          //  can. The UI only allows 90 days
          var lowMs = new Date().getTime();
          lowMs = lowMs - 90 * 1000*60*60*24;
          var low = new Date(lowMs);
          $('input.lowDate').val(
            (low.getMonth()+1) + '/' + low.getDate() + '/' + low.getFullYear()
          );
          $('button.showButton').click();
        });
        //  Wait for the updated history
        waitfor(3000).then(function() {
          //  Now, scrape the data
          var data = page.evaluate(function() {
            var trs = $('#checkinhistory table tbody tr');
            return $.map(trs, function(tr) {
              var dateStr = $(tr.children[0]).text();
              var timeStr = $(tr.children[1]).text();
              var loc = $(tr.children[2]).text();
              var date = Date.parse(dateStr + ' ' + timeStr);
              return [[date, loc]];
            });
          });
          writeCSV(data);
          phantom.exit();
        });
      });
    });
  });
});

