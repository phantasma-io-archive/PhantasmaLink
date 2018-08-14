// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
});


chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		let tab = tabs[0];
		let tabURL = tab.url;
		
        if (tabURL.includes("localhost") || tabURL.includes("file://"))
        {
			//alert(tabURL);
            chrome.pageAction.show(tab.id);
        }	
	});
}); 

