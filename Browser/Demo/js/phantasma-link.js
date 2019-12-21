var _phantasmaFuncName = 'PhantasmaLink';
var _phantasmaLinkInitialized = false;

function IsPhantasmaLinkInstalled() {
	return typeof window[_phantasmaFuncName] !== 'undefined' && $.isFunction(window[_phantasmaFuncName]);
}

function FindPhantasmaLink() {	
	if (!_phantasmaLinkInitialized) {
		if (IsPhantasmaLinkInstalled()) {
			console.log('Phantasma Link detected!');
		}
		else {
			window[_phantasmaFuncName] = function () {
				return {
					Version: "v0.0",
					Login : function(callback) {
						let token = null;
						let error = 'Phantasma Link extension is not installed. Get it <a href="https://phantasma.io/extensions">here</a>';
						callback(token, error);
					}
				}; 	
			};

			console.log('Phantasma Link not detected..');	
		}
		_phantasmaLinkInitialized = true;
	}
	
	return new PhantasmaLink();
}