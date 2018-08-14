var s = document.createElement('script');
s.src = chrome.extension.getURL('phantasma.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

