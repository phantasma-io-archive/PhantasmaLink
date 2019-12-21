/*var s = document.createElement('script');
s.src = chrome.extension.getURL('phantasma.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
	console.log("injected Phantasma Link");
    s.parentNode.removeChild(s);
};*/

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    // If the received message has the expected format...
    if (msg.text === 'detect_phantasma_link') {
		let _phantasmaFuncName = 'PhantasmaLink';
		let isEnabled = (typeof window[_phantasmaFuncName] !== 'undefined' && $.isFunction(window[_phantasmaFuncName]));
		console.log("enabled = " + isEnabled);
		if (isEnabled) {
			callback(isEnabled);
		}
    }
});