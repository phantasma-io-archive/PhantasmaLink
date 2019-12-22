(function($){$.fn.fakeLoader=function(options){var bindLoader=$(this).data("fakeLoader:initial");if(bindLoader){bindLoader.settings=$.extend(bindLoader.settings,options);return}$(this).data("fakeLoader:initial",this);var settings=$.extend({timeToHide:1200,pos:"fixed",top:"0px",left:"0px",width:"100%",height:"100%",zIndex:"999",bgColor:"#2ecc71",spinner:"spinner7",imagePath:"",blockMode:false,release:false},options);this.settings=settings;var spinner01='<div class="fl spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';var spinner02='<div class="fl spinner2"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>';var spinner03='<div class="fl spinner3"><div class="dot1"></div><div class="dot2"></div></div>';var spinner04='<div class="fl spinner4"></div>';var spinner05='<div class="fl spinner5"><div class="cube1"></div><div class="cube2"></div></div>';var spinner06='<div class="fl spinner6"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';var spinner07='<div class="fl spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>';var el=$(this);var initStyles={position:settings.pos,width:settings.width,height:settings.height,top:settings.top,left:settings.left};el.css(initStyles);el.each(function(){var a=settings.spinner;switch(a){case"spinner1":el.html(spinner01);break;case"spinner2":el.html(spinner02);break;case"spinner3":el.html(spinner03);break;case"spinner4":el.html(spinner04);break;case"spinner5":el.html(spinner05);break;case"spinner6":el.html(spinner06);break;case"spinner7":el.html(spinner07);break;default:el.html(spinner01)}if(settings.imagePath!=""){el.html('<div class="fl"><div id="phantasma_link_msg" class="text-center" style="color:gray">Initializing...</div><br><img src="'+settings.imagePath+'"></div>')}centerLoader()});if(settings.blockMode==false){setTimeout(function(){$(el).fadeOut()},settings.timeToHide)}else{setInterval(function(){if(settings.release==true){$(el).fadeOut()}},settings.timeToHide)}return this.css({backgroundColor:settings.bgColor,zIndex:settings.zIndex})};function centerLoader(){var winW=$(window).width();var winH=$(window).height();var spinnerW=$(".fl").outerWidth();var spinnerH=$(".fl").outerHeight();$(".fl").css({position:"absolute",left:winW/2-spinnerW/2,top:winH/2-spinnerH/2})}$(window).load(function(){centerLoader();$(window).resize(function(){centerLoader()})})})(jQuery);


String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '...' : this;
      };
	  	 

//https://javascript.info/websocket
class PhantasmaLink {
	constructor(dappID) {
		this.host = "localhost:7080";
		this.dapp = dappID;

		this.createSocket();
	}
	

	createSocket() {
		let path = "ws://"+ this.host +"/phantasma";
		this.setLinkMsg('Phantasma Link connecting: ' + path);
		this.socket = new WebSocket(path);
		this.requestCallback = null;
		this.token = null;
		this.account = null;

		this.requestID = 0;
		this.showModal();

		$('#account_connection').html('Unconnected');

		var that = this;
		this.socket.onopen = function(e) {
			that.setLinkMsg('Connection established, authorizing...');
			that.sendLinkRequest('authorize/' + that.dapp, function(result){
			
				if (result.success) {
					that.token = result.token;
					that.wallet = result.wallet;
					that.setLinkMsg('Authorized, obtaining account info...');
					that.sendLinkRequest('getAccount', function(result){
						if (result.success) {
								that.account = result;
								that.setLinkMsg('Ready, opening dapp...');
								that.hideModal();
														
								$("#account_avatar").attr("src", that.account.avatar);
								$('#account_name').text(that.account.name);						
								$('#account_address').text(that.account.address.trunc(20));						
								$('#account_connection').html('<i class="fas fa-bullseye"></i> ' + that.wallet);
						}
						else {
							that.setLinkMsg('Could not obtain account info...<br>Make sure you have an account currently open in '+that.wallet);
						}
					});
				}
				else {
					that.setLinkMsg('Authorization failed...');
				}			
			});
		};

		this.socket.onmessage = function(event) {

			console.log("Got Phantasma Link answer: " + event.data);

			var obj = JSON.parse(event.data);
				
			var temp = that.requestCallback;
			if (temp == null) {
				that.setLinkMsg('Something bad happened...');
				return;
			}
			
			that.requestCallback = null;
			temp(obj);
		};

		this.socket.onclose = function(event) {
		  if (!event.wasClean) {
			$('#phantasmaError').modal('show');
			that.setLinkMsg('Connection died...');
		  }
		};

		this.socket.onerror = function(error) {
			that.setLinkMsg('Error: '+ error.message);
		};
	}
	
	retry() {
		$('#phantasmaError').modal('hide');
		this.createSocket();
	}		

	get dappID() {
		return this.dapp;
	}
	
	sendLinkRequest(request, callback) {
		console.log("Sending Phantasma Link request: " + request);
		
		if (this.token != null) {
			request = request + '/'+this.dapp+'/'+this.token;
		}
		
		this.requestID++;
		request = this.requestID+','+request;
		
		this.requestCallback = callback;
		this.socket.send(request);
	}
	
	setLinkMsg(msg) {
		$('#phantasma_link_msg').html(msg);
	}

	showModal() {
		$("#fakeLoader").fakeLoader({
				blockMode:true, //set fakeLoader use blockMode    
				timeToHide:1200, //Time in milliseconds for fakeLoader check release status
				zIndex:999, // Default zIndex
				spinner:"spinner7", 
				bgColor:"#EDFBFF", //Hex, RGB or RGBA colors
				imagePath:"phantasma.png" //If you want can you insert your custom image

		});
	}
	
	hideModal() {
		setTimeout(function () {
			$("#fakeLoader").fakeLoader({
					release:true
			});
		}, 1500);
	}
}
