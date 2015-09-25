// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getSSAccount(callback, errorCallback) {
  // Crawl Shadowsock account and password from www.ishadowsocks.com and save to account
  renderStatus('Crawling free Shadowsocks accounts...');
  

  var x = new XMLHttpRequest();  
  x.open('GET', 'http://www.ishadowsocks.com/');
  x.responseType = 'document';

  x.onload = function() {
    renderStatus('Done!');
    // Parse and process the response from www.ishadowsocks.com.
    var source = x.responseXML;
    //if (!response || !response.responseData || !response.responseData.results ||
    //    response.responseData.results.length === 0) {
    //    errorCallback('No response from www.ishadowsocks.com!');
    //  return;
    //}
    
    if (this.status == 200) {
      var section = source.getElementById('free');
      var info = section.getElementsByTagName('h4');
      
      var accounts = new Array();

      var account0 = new Array(); 
      account0['address'] = info[0].childNodes[0].nodeValue.split(':')[1];
      account0['port'] = info[1].childNodes[0].nodeValue.split(':')[1];
      account0['password'] = info[2].childNodes[0].nodeValue.split(':')[1];
      account0['mode'] = info[3].childNodes[0].nodeValue.split(':')[1];
      accounts.push(account0);

      var account1 = new Array(); 
      account1['address'] = info[6].childNodes[0].nodeValue.split(':')[1];
      account1['port'] = info[7].childNodes[0].nodeValue.split(':')[1];
      account1['password'] = info[8].childNodes[0].nodeValue.split(':')[1];
      account1['mode'] = info[9].childNodes[0].nodeValue.split(':')[1];
      accounts.push(account1);
       
      var account2 = new Array(); 
      account2['address'] = info[12].childNodes[0].nodeValue.split(':')[1];
      account2['port'] = info[13].childNodes[0].nodeValue.split(':')[1];
      account2['password'] = info[14].childNodes[0].nodeValue.split(':')[1];
      account2['mode'] = info[15].childNodes[0].nodeValue.split(':')[1];
      accounts.push(account2);
      
      callback(accounts);
    }

  };
  x.onerror = function() {
    errorCallback('Network error！');
  };
  x.send();
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function genQRCode(accounts) {
  // Convert account to QR code
  var i, len;
  for (i = 0, len = accounts.length; i < len; i++) {
  	// construct ss://method:password@hostname:port
  	var uri = accounts[i]['mode'] + ':' + accounts[i]['password'] + '@' + accounts[i]['address'] + ':' + accounts[i]['port'];
  	document.getElementById('account' + i).textContent = 'ss://' + uri;
    uri = 'ss://' + window.btoa(uri);
    $("#code" + i).qrcode({render: "table", width: 150, height: 150, text: uri});
  }
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getSSAccount(genQRCode, function(errorMessage) {
      renderStatus('Cannot cssssrawl page. ' + errorMessage);
  });
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
  var newURL = "popup.html";
  chrome.tabs.create({ url: newURL });
});

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
