Template7.registerHelper('stringify', function (context){
    var str = totalStringify(context);
    // Need to replace any single quotes in the data with the HTML char to avoid string being cut short
    return str.split("'").join('&#39;');
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var isAjaxLoaded=false;
var isAjaxLoadedLoop=false;
var pathToAjaxDispatcher="https://www.laughsterapp.com/php/ajaxDispatcher1.php";
var pathToJSTemplates="js/templates/";

var currentSectionTitle="";

var GOOGLE_MAPS_STATIC_V3_API_KEY="AIzaSyDHD5QKg6Z6pBIPLjzo2VOTvi37t6IRJ_o";
var appID=227444216;

var currentLocation=false;

var loadedPodcastEpisodes=new Array();

var clickedForFirstTimeSections=new Array();

var mainView;
var loginView;

var registrationFormObject={};

var homePageReloaded=false;

var homePageReachedFromLogin=false;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Frank Spadone',
    // App id
    id: 'com.laughster.frankspadone',
    cache: false,
    cacheDuration: 0, /* set caching expire time to 0 */
    touch: {
      tapHold: true //enable tap hold events
    },
    statusbar: {
        iosOverlaysWebView: false
    },
    view: {
        iosDynamicNavbar: false
    }
});

var viewLoginOptions={
    routes: [
        {
          name: 'login',  
          path: '/',
          componentUrl: pathToJSTemplates + 'login.htm',
          tabs: [
            // First (default) tab has the same url as the page itself
            { 
                path: '/',
                id: 'welcome-tab-1',
                componentUrl: pathToJSTemplates + 'welcome-tab-1.htm'
            },
            // Second tab
            {
              path: '/welcome-tab-2/',
              id: 'welcome-tab-2',
              componentUrl: pathToJSTemplates + 'welcome-tab-2.htm'
            },
            // Third tab
            {
              path: '/welcome-tab-3/',
              id: 'welcome-tab-3',
              componentUrl: pathToJSTemplates + 'welcome-tab-3.htm'
            },
            // Fourth tab
            {
              path: '/welcome-tab-4/',
              id: 'welcome-tab-4',
              componentUrl: pathToJSTemplates + 'welcome-tab-4.htm'
            }
          ]
        }
  ],
  url: "/"
};

var mainViewOptions={
    routes: [
        {
          name: 'home',  
          path: '/',
          componentUrl: pathToJSTemplates + 'home.htm'
        },
        {
            name: 'events',
            path: '/events/',
            componentUrl: pathToJSTemplates + 'events.htm'
        },
        {
            name: 'eventdetails',
            path: '/eventdetails/',
            componentUrl: pathToJSTemplates + 'eventDetails.htm'
        },
        {
            name: 'news',
            path: '/news/',
            componentUrl: pathToJSTemplates + 'news.htm'
        },
        {
            name: 'videos',
            path: '/videos/',
            componentUrl: pathToJSTemplates + 'videos.htm'
        },
        {
            name: 'videodetails',
            path: '/videodetails/',
            componentUrl: pathToJSTemplates + 'videoDetails.htm'
        },
        {
            name: 'podcasts',
            path: '/podcasts/',
            componentUrl: pathToJSTemplates + 'podcasts.htm'
        },
        {
            name: 'podcastdetails',
            path: '/podcastdetails/',
            componentUrl: pathToJSTemplates + 'podcastDetails.htm'
        }
  ],
    url: "/",
    stackPages: true,
    preloadPreviousPage: false
};

function initAPP(){
    //Check wether user is logged in or not
    if(localStorage.getItem("userAPPLoggedIn")===null){
        loginView = app.views.create('#view-login', viewLoginOptions);
        app.tab.show("#view-login", false);
    }else{
        mainView = app.views.create('#view-main', mainViewOptions);
        app.tab.show("#view-main", false);
    }
}

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

var swiper = app.swiper.create('.swiper-container', {
    speed: 400,
    spaceBetween: 100
});

var isCordovaApp = document.URL.indexOf('http://') === -1
  && document.URL.indexOf('https://') === -1;

if(isCordovaApp) { 
    $$(document).on('deviceready', function() {
        console.log("Device is ready!");
            initAPP();
            setupGeoLocation();
            setupPushInit();

     });
 }else{
    initAPP();
    setupGeoLocation1();
 }
 
 $$.fn.setCustomValidityFormTranslations=function(){
    return this.each(function(){
        var $this=$$(this);
        $this.find("input[type=text], input[type=number], input[type=email], input[type=url], input[type=password], input[type=radio], input[type=checkbox], textarea, select").on('change invalid', function() {
            var textfield = $$(this)[0];
            var customMessage=textfield.getAttribute("data-validity-title");
            if(customMessage=="" || customMessage==null){
                customMessage="Please fill this field";
            }

            // 'setCustomValidity not only sets the message, but also marks
            // the field as invalid. In order to see whether the field really is
            // invalid, we have to remove the message first
            textfield.setCustomValidity('');

            if (!textfield.validity.valid) {
              textfield.setCustomValidity(customMessage); 
              $$(this).addClass("shake missingField");
            }
        });
    });
};

 $$.fn.wrapAudioPlayerPlyr = function(){
     return this.each(function(){
        var $this=$$(this);
        
        //const player = new Plyr('#player');
    });
};

$$.fn.bornDatePicker = function(){
    return this.each(function(){
        var $this=$$(this);
        
        var bornDayField=$this.find("select[name='aEOE_appuserbornday']");
        var bornMonthField=$this.find("select[name='aEOE_appuserbornmonth']");
        var bornYearField=$this.find("input[name='aEOE_appuserbornyear']");
        
        //populate all selectboxes
        var arrDays=new Array();
        for(var i=1; i<=31; i++){
            arrDays[i]=i;
        }
        
        var arrMonths=new Array();
        arrMonths[1]="January";
        arrMonths[2]="February";
        arrMonths[3]="March";
        arrMonths[4]="April";
        arrMonths[5]="May";
        arrMonths[6]="June";
        arrMonths[7]="July";
        arrMonths[8]="August";
        arrMonths[9]="September";
        arrMonths[10]="October";
        arrMonths[11]="November";
        arrMonths[12]="December";
        
        bornDayField.html("").html(wrapSBOptions(arrDays, 'Day'));
        bornMonthField.html("").html(wrapSBOptions(arrMonths, 'Month'));
        
        bornYearField.on("keyup", function(){
            var correct=false;
            var $this2=$$(this);
            var maxLength=parseInt($this2.attr("maxlength"));
            var pattern=new RegExp($this2.attr("pattern"));
            var currentLength=parseInt($this2.val().length);
            if(currentLength-maxLength>0){
               var newVal=$this2.val().substr(0, maxLength);
               $this2.val(newVal);
           }
           currentLength=parseInt($this2.val().length);
            if(!pattern.test($this2.val())){
                $this2.addClass("missingField");
                correct=false;
            }else{
                $this2.removeClass("missingField");
                correct=true;
            }
            if(currentLength>=maxLength && correct){
                $this2.blur();
            }
        });
        
    });
};

 
 $$.fn.wrapAudioPlayers = function(){
     return this.each(function(){
        var $this=$$(this);
        var src=$this.attr("data-src");
        var srcType=$this.attr("data-sourcetype");
        var player=$this.find("audio")[0];
        var fakeBuffer=$this.find("a[data-target='forceFakePlay']")[0];
        var controls=$this.find("div.wrap-custom-player-controls");
        var btn=controls.find("div.buttons-play");
        var playBtn=controls.find("div.wrap-custom-player-playbutton");
        var pauseBtn=controls.find("div.wrap-custom-player-pausebutton");
        var progressBg=controls.find("div.wrap-custom-player-loader-bg");
        var progressBar=progressBg.find("div.wrap-custom-player-progress-bar");
        var bufferBar=progressBg.find("div.wrap-custom-buffer");
        var playerSeeker=progressBar.find("div.wrap-player-seeker");
        var progressTime=controls.find("div.wrap-custom-player-progress-time");
        var isPlaying = false;
        
        //var audioBuffer = new Mediabuffer(document.getElementById('audio'), audioProgress, audioReady);
        //document.getElementById('playbtn').addEventListener('click', audioLoad, true);
        
        var rangeSlider = app.range.get('.range-slider');
        
        var knob=rangeSlider.knobs[0];
        
        var dogBarkingBuffer = null;
        // Fix up prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        
        
        //Auto play/pause/settime to 0
        //To tweak buffering
        fakeBuffer.click();
        
        rangeSlider.$el.mousedown(function(e){
           player.pause();
           isPlaying = false;
           btn.removeClass('paused');
        });
        rangeSlider.$el.mouseup(function(e){
            seek(rangeSlider.getValue()/1000, player);
            player.play();
            btn.addClass('paused preloader-in-act');
            isPlaying = true;
        });
        
        var currentIndex=$this.closest(".singleItem").index();
        
        goAction(controls);
        
        function goAction(){
            btn.click(function(){
                togglePlay();
            });
        }
        
    });
 };
 
 $$.fn.deactivateAllItems = function(item, whatClass){
    return this.each(function(){
        var $this=$$(this);
        $$($this).find(item).each(function(i){
            $$(this).removeClass(whatClass);
        });
  
    });  
};

$$.fn.deactivatedOneByOne = function(item, whatClass){
    return this.each(function(){
        var $this=$$(this);
        $$($this).find(item).each(function(i){
            var row = $$(this);
            setTimeout(function() {
                row.removeClass(whatClass);
            }, 100*i);
        });
  
    });  
};
 
 $$.fn.activatedOneByOne = function(item, whatClass){
     var removeClassAfter=null;
     if(arguments[2]){
         removeClassAfter=arguments[2];
     }
    return this.each(function(){
        var $this=$$(this);
        $$($this).find(item).each(function(i){
            var row = $$(this);
            setTimeout(function() {
                row.addClass(whatClass);
                if(removeClassAfter!==null){
                    setTimeout(function(){
                        row.removeClass(removeClassAfter);
                    }, 700);
                }
            }, 100*i);
        });
  
    });  
};
 
 var DP = (typeof DP === "object") ? DP : {};

$$.fn.checkFields = function(){
    var formName=$$(this).attr("id");
    var $this=$$(this);
    switch(formName){
        default:
        var vl = new DP.validateForm();
        vl.valSetting = {fields : []};
        
        if($this.find("[required]").length>0){
               $this.find("[required]").each(function(){
                   var whatTypeCheckVS="";
                   if($$(this).attr("type")=="email"){
                       whatTypeCheckVS="email";
                   }
                    vl.valSetting.fields.push(
                    {id : $$(this).attr("name"), val : "", msg : $$(this).attr("placeholder"), type : whatTypeCheckVS});
               });
            }
        return vl.runCheck(formName);
        break;
    }
};

DP.validateForm = function(){
    //generic check value method
    var formValidated = function(whatForm){	
        if(typeof(whatForm)!="undefined"){
                isfrmAddEditUserSubmit=true;
                 whatForm.submit();	
                 return true;
        }
    };
	
    var fromReset = function(elmId, wrongValue, messageText){
        //reset
        $$(".from_wrp input").css({"border":"1px solid #ACA69F"});
        $$(".from_wrp select").css({"border":"1px solid #ACA69F"});
        $$("#error_messages").empty("");
    }

    //generic check value method
    var valueCheck = function(elmId, wrongValue, messageText){
        if($$("[name='" + elmId + "']").val() == wrongValue){
            createAlert(elmId, messageText);
			return false;
		}
			removeAlert(elmId);
			return true;
    };
    
    //alert method
    var createAlert = function(elmId, messageText){
		elmId.addClass("missingField");
        stringAlert +="<p>" + messageText + "</p>";
    };
    var removeAlert = function(elmId){
            elmId.removeClass("missingField");
    };

    //zip validation
    var isZip = function(s){
        var reZip = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        if (!reZip.test(s)) {
            return false;
        }
        return true;
    };
    
    //checks if value is integer
    var isInt = function(n){
        var reInt = new RegExp(/^\d+$/);
        if (!reInt.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin
    var isPin = function(n){
        var rePin = new RegExp(/^\w{4,8}$/);
        if (!rePin.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin2
    var isPin2 = function(n){
        var rePin2 = new RegExp(/^\w{8,24}$/);
        if (!rePin2.test(n)) {
            return false;
        }
        return true;
    };
	//checks if value is integer
    var isPrice = function(n){
        var rePrice = new RegExp(/^\d+($|\,\d{3}($|\.\d{1,2}$)|\.\d{1,2}$)/);
        if (!rePrice.test(n)) {
            return false;
        }
        return true;
    };
	
	//mail validation
    var isMail = function(s, elmId){
        var reMail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!reMail.test(s)) {
            return false;
        }		
        return true;
    };
    
    	//checks if value is password
    var isPassword = function(n){
        var rePassword = new RegExp(/^[\w!!?]{6,18}$/);
        if (!rePassword.test(n)) {
            return false;
        }
        return true;
    };
    
    
    //public method checks fieds
    //requires 'valSetting' setting object
	
    this.runCheck = function(whatForm){
        //reseet form		
        //run checks
		var countTrueFilled=0;
		
		stringAlert="";
        for (i=0;i<this.valSetting.fields.length;i++){
			var fName=this.valSetting.fields[i].id;
			var fVal=this.valSetting.fields[i].val;
			var fieldName=$$("#"+whatForm+" [name='" + this.valSetting.fields[i].id + "']");
                        var fMessage=this.valSetting.fields[i].msg==""?fieldName.closest("div").find("label").text():this.valSetting.fields[i].msg;
            
            if(this.valSetting.fields[i].type == "zip"){
                //zip check
                if(isZip(fieldName.val()) == false){    
                    createAlert(fieldName, this.valSetting.fields[i].msg);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else if (this.valSetting.fields[i].type == "number"){
                //checks for number
                if(isInt(fieldName.val()) == false || fieldName.val()==fVal){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
			else if (this.valSetting.fields[i].type == "price"){
                //checks for number
                if(isPrice(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin"){
                //checks for number
                if(isPin(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin2"){
                //checks for number
                if(isPin2(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "password"){
                //checks for number
                if(isPassword(fieldName.val(), fName) === false){ 
                    createAlert(fieldName, fMessage);
                }
				else{
                                    if(fName=='aEOE_passwordagain'){
                                        if(fieldName.val()!=$$("#"+whatForm+ " [name='aEOE_password']").val()) createAlert(fieldName, "Passwords must match.");
                                        else{
                                           removeAlert(fieldName);
                                            countTrueFilled++; 
                                        }
                                    }else{
                                        removeAlert(fieldName);
                                        countTrueFilled++;
                                    }
					
				}
            }
			else if (this.valSetting.fields[i].type == "email"){
                //checks for number
                if(isMail(fieldName.val(), fName) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else{
                //checks for value
                if(fieldName.val()==fVal){
                    createAlert(fieldName, fMessage);
                }else{
                    removeAlert(fieldName);
                    countTrueFilled++;
		}
            }
        }
                if(countTrueFilled>=this.valSetting.fields.length){
			switch(whatForm){
				default:
                                    $$("#"+whatForm + " div[data-target='ifwrong']").addClass("hidden");
                                    if(isAjaxLoaded) return false;
                                    isAjaxLoaded=true;
                                    var postData=app.form.convertToData("#"+whatForm);
                                    switch(whatForm){
                                        case "frmRegisterAPPUserFE":
                                            switch($$("#"+whatForm + " input[name='context']").val()){
                                                case "registerAPPUserFEStep1":
                                                    isAjaxLoaded=false;
                                                    //First check all are data entered and valid
                                                    var comedianID=parseInt($$("#"+whatForm + " input[name='aEOE_comedianuserid']").val());
                                                    var userAPPName=$$("#"+whatForm + " input[name='aEOE_name']").val();
                                                    var userAPPEmail=$$("#"+whatForm + " input[name='aEOE_email']").val();
                                                    if(comedianID<=0){
                                                        app.dialog.alert('Missing comedian ID.');
                                                        return false;
                                                    }
                                                    if(userAPPName==""){
                                                        app.dialog.alert('Please Provide your First and Last name.');
                                                        return false;
                                                    }
                                                    if(userAPPEmail==""){
                                                        app.dialog.alert('Please Provide your Email Address.');
                                                        return false;
                                                    }
                                                    
                                                    registrationFormObject["context"]="registerAPPUserFEStep1";
                                                    registrationFormObject["aEOE_comedianuserid"]=comedianID;
                                                    registrationFormObject["aEOE_name"]=userAPPName;
                                                    registrationFormObject["aEOE_email"]=userAPPEmail;
                                                    
                                                    $$("a[data-route-tab-id='welcome-tab-2']").click();
                                                    return false;
                                                break;
                                                
                                                case "registerAPPUserFEStep4":
                                                    isAjaxLoaded=false;
                                                    //First check all are data entered and valid
                                                    var countryID=parseInt($$("#"+whatForm + " select[name='aEOE_appusercountry']").val());
                                                    var provinceID=parseInt($$("#"+whatForm + " select[name='aEOE_appuserprovince']").val());
                                                    var userAPPCity=$$("#"+whatForm + " input[name='aEOE_appusercity']").val();
                                                    if(userAPPCity==""){
                                                        app.dialog.alert('Please Provide your City name.');
                                                        return false;
                                                    }
                                                    if(provinceID<=0){
                                                        app.dialog.alert('Please Provide your Province.');
                                                        return false;
                                                    }
                                                    if(countryID<=0){
                                                        app.dialog.alert('Please Provide your Country.');
                                                        return false;
                                                    }
                                                    
                                                    registrationFormObject["context"]="registerAPPUserFEStep4";
                                                    registrationFormObject["aEOE_appusercountry"]=countryID;
                                                    registrationFormObject["aEOE_appuserprovince"]=provinceID;
                                                    registrationFormObject["aEOE_appusercity"]=userAPPCity;
                                                    
                                                    $$("a[data-route-tab-id='welcome-tab-3']").click();
                                                    return false;
                                                break;
                                                
                                                case "registerAPPUserFinalFE":
                                                    //Check are all fields for born date filled in and valid
                                                    var userAPPBornDay=$$("#"+whatForm + " select[name='aEOE_appuserbornday']").val();
                                                    var userAPPBornMonth=$$("#"+whatForm + " select[name='aEOE_appuserbornmonth']").val();
                                                    var userAPPBornYear=$$("#"+whatForm + " input[name='aEOE_appuserbornyear']").val();
                                                    
                                                    var userAPPCity=$$("#"+whatForm + " input[name='aEOE_appusercity']").val();
                                                    
                                                    if(!isValidDate(userAPPBornDay, userAPPBornMonth, userAPPBornYear)){
                                                        app.dialog.alert('Please provide a valid date of birth.');
                                                        isAjaxLoaded=false;
                                                        return false;
                                                    }
                                                    $$("#"+whatForm + " input[name='context']").val("registerAPPUserFE");
                                                    
                                                    registrationFormObject["context"]="registerAPPUserFE";
                                                    registrationFormObject["aEOE_appuserbornday"]=userAPPBornDay;
                                                    registrationFormObject["aEOE_appuserbornmonth"]=userAPPBornMonth;
                                                    registrationFormObject["aEOE_appuserbornyear"]=userAPPBornYear;
                                                    registrationFormObject["aEOE_appusercity"]=userAPPCity;
                                                    
                                                    postData=registrationFormObject;
                                                    
                                                break;
                                            }
                                        break;
                                    }
                                    
                                    
                                    app.request.post(
                                        pathToAjaxDispatcher, 
                                        postData, 
                                        function(data){
                                            isAjaxLoaded=false;
                                            if(data["success"]==1){
                                                switch(whatForm){
                                                    case "frmRegisterAPPUserFE":
                                                        var tempObj={};
                                                        tempObj.userappid=data["userappid"];
                                                        $$("input[name='userAPPID']").val(data["userappid"]);
                                                        localStorage.setItem("userAPPLoggedIn", data["userappid"]);
                                                        
                                                        //we should update the current userAPPInfo local storage
                                                        if(localStorage.getItem("userAPPInfo")!==null){
                                                        var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
                                                            if(typeof(simpleComedian)=="object"){
                                                                //Update store url for registered Fan
                                                                simpleComedian.onlinestoreurl +="/"+data["userappid"];
                                                                localStorage.setItem("userAPPInfo", totalStringify(simpleComedian));
                                                            }
                                                        }
                                                        
                                                        homePageReachedFromLogin=true;
                                                        $$("#frmRegisterAPPUserFE").addClass("animated fadeOut");
                                                        app.views.create('#view-main', mainViewOptions);
                                                        setTimeout(function(){
                                                            $$("#frmRegisterAPPUserFE").remove();
                                                            $$("#view-login #appImgOnLogin").addClass("fadeOut");
                                                            $$("#view-main").addClass("tab-active activated"); 
                                                        }, 200);
                                                    break;
                                                }
                                            }else{
                                                dynamicPopup.emit('open-custom', data["message"]);
                                            }
                                        }, function(xhr, status){
                                            isAjaxLoaded=false;
                                            console.log(status);
                                        },
                                        "json"
                                    );
				break;
			}
		}else{
                    switch(whatForm){
                        default:
                            
                        break;
                        case "frmRegisterAPPUserFE":
                            $$("#"+whatForm + " div[data-target='ifwrong']").removeClass("hidden");
                        break;
                    }
                    
                    return false;
		}
		
    };
	
	
};

 $$(document).on("click", "a[data-action='trackclicks'], button[data-action='trackclicks']", function(e){
     var $this=$$(this);
     var currentContext=$this.attr("data-context");
     var postData={context: $this.attr("data-context")};
     var userAPPIDCurrent=$$("input[name='userAPPID']").val();
     if(appID!==null && appID!==""){
        postData["appid"]=appID;
        if($this.attr("data-socialbutton")){
            postData["socialbutton"]=$this.attr("data-socialbutton");
        }
        if($this.attr("data-etype")){
            postData["etype"]=$this.attr("data-etype");
        }
        if($this.attr("data-id")){
            postData["id"]=$this.attr("data-id");
        }
        if(localStorage.getItem("userAPPInfo")!==null){
            var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(simpleComedian)!=="undefined"){
                if(localStorage.getItem("userAPPLoggedIn")!==null){
                    var userAPPID=localStorage.getItem("userAPPLoggedIn");
                    postData["userappid"]=userAPPID;
                    sendAjaxOnFly(postData, null, null);
                }
            }
        }
     }
 });
 
 $$(document).on("click", "a[data-action='addedititem'], button[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    var currentContext=$this.attr("data-context");
    
    var postData={context: $this.attr("data-context")};
    
    if($this.attr("data-id")){
        postData["id"]=$this.attr("data-id");
    }
    if($this.attr("data-target-tab")){
        postData["target-tab"]=$this.attr("data-target-tab");
    }
    if($this.attr("data-etype")){
        postData["etype"]=$this.attr("data-etype");
    }
    
    switch(postData["context"]){
        case "rsvpEvent":
            var userAPPIDCurrent=$$("input[name='userAPPID']").val();
            if(appID!==null && appID!==""){
                postData["appid"]=appID;
                if(localStorage.getItem("userAPPInfo")!==null){
                    var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
                    if(typeof(simpleComedian)!=="undefined"){
                        if(localStorage.getItem("userAPPLoggedIn")!==null){
                            var userAPPID=localStorage.getItem("userAPPLoggedIn");
                            postData["userappid"]=userAPPID;
                            sendAjaxOnFly(postData, null, null);
                        }
                    }
                }
            }
        break;
    }
});

$$("form[data-action='handlewithform']").setCustomValidityFormTranslations();

$$(document).on("submit", "form[data-action='handlewithform']", function(e){
    e.preventDefault();
    $$(this).checkFields();
    return false;
});

$$(document).on("change", "select[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    var postData={id: $this.attr("data-id"), context: $this.attr("data-context")};
    
    switch(postData["context"]){
        
    }
});

$$(window).on('orientationchange',function(e){
  console.log(e.orientation)
});

function loadHomeAdvancedComedian(self, appID){
    if(appID!==null && appID!==""){
        var postData={context: "loadHomeBasicComedian", appid: appID, regions: 1};
        if(localStorage.getItem("userAPPInfo")!==null){
            var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(simpleComedian)!=="undefined"){
                if(localStorage.getItem("userAPPLoggedIn")!==null){
                    userAPPID=localStorage.getItem("userAPPLoggedIn");
                    postData["userappid"]=userAPPID;
                }
            }
        }
        app.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    localStorage.setItem("userAPPInfo", totalStringify(data["results"]));
                    self.$setState(data["results"]);
                    setTimeout(function(){
                       self.$setState({
                           classInitHidden: ""
                       });
                       setTimeout(function(){
                           self.$setState({
                                classStoreBtnHidden: "zoomIn"
                            });
                            setTimeout(function(){
                                self.$setState({
                                    classStoreBtnBadgeHidden: "fadeIn"
                                });
                            }, 1000)
                       }, 1000);
                    }, 1000);
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
        );
    }
}

function pushSetupComedian(appID){
    if(appID!==null && appID!==""){
        var userAPPID=$$("input[name='userAPPID']").val();
        
        if(localStorage.getItem("userAPPInfo")!==null){
            var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(simpleComedian)!=="undefined"){
                if(localStorage.getItem("userAPPLoggedIn")!==null){
                    userAPPID=localStorage.getItem("userAPPLoggedIn");
                }
            }
        }
        
        if(isCordovaApp) {
            var push = PushNotification.init({
                "android": {},
                "ios": {
                  "sound": true,
                  "alert": true,
                  "badge": true
                },
                "windows": {}
            });

            push.on('registration', function(data) {
                console.log("Comedian ID: " + appID);
                console.log("registration event: " + data.registrationId);
                var oldRegId = localStorage.getItem('registrationId');
                if (oldRegId !== data.registrationId) {
                    // Save new registration ID
                    localStorage.setItem('registrationId', data.registrationId);
                    // Post registrationId to your app server as the value has changed
                }
                var newRegID=localStorage.getItem('registrationId');
                
                var postData={context: "pushSetupComedian", appid: appID, userappid: userAPPID, senderid: newRegID, oldsenderid: oldRegId};
                app.request.post(
                    pathToAjaxDispatcher, 
                    postData, 
                    function(data){
                        isAjaxLoaded=false;
                        if(data["success"]==1){
                            console.log("Success: " + appID + " " + newRegID);
                        }else{
                            console.log(data["message"]);
                        }
                    }, function(xhr, status){
                        isAjaxLoaded=false;
                        console.log(status);
                    },
                    "json"
                );
            });

            push.on('error', function(e) {
                console.log("push error = " + e.message);
            });

            push.on('notification', function(data) {
                  console.log('notification event');
                  navigator.notification.alert(
                      data.message,         // message
                      null,                 // callback
                      data.title,           // title
                      'Ok'                  // buttonName
                  );
              });
            }
        
        
        
        
        
    }
}

function loadHomeBasicComedian(self, appID){
    if(appID!==null && appID!==""){
        var postData={context: "loadHomeBasicComedian", appid: appID, regions: 1};
        app.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    localStorage.setItem("userAPPInfo", totalStringify(data["results"]));
                    self.$setState(data["results"]);
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
        );
    }
}

function loadWelcomeTabRegions(self){
    var postData={context: "loadWelcomeTabRegions"};
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                var results=data["results"];
                results.countriesObject=results;
                self.$setState(results);
            }else{
                dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
    );
}

function loadWelcomeTabBasicComedian(self, appID){
    if(appID!==null && appID!==""){
        var postData={context: "loadWelcomeTabBasicComedian", appid: appID};
        app.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    var results=data["results"];
                    self.$setState(results);
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
        );
    }
}

function loadNextTab(id){
    $$("a[data-route-tab-id='" + id +"']").click();
}

function loadWelcomeTabLocationComedian(self){
        if(localStorage.getItem("currentLocation")!==null){
            var localStorageData=JSON.parse(localStorage.getItem("currentLocation"));
            self.$setState(localStorageData);
        }
}

function stopPlayer(player, btn, bufferBar){
    var rangeSlider = app.range.get('.range-slider');
    player.pause();
    player.removeAttribute("src");
    player.preload = "none";
    rangeSlider.setValue(0);
    bufferBar.css({width: 0});
    btn.removeClass('paused');
    player.load();
}

function loadPlayList(self, context, id, flag){
    switch(context){
        case "loadPodcastEpisode":
            var podcastEpisode=getPodcastEpisodeFromCache(id, flag);
            if(podcastEpisode!==null){
                //update context
                podcastEpisode.classAnimatedPlayer="fadeInUp";
                podcastEpisode.classAnimatedTitle="fadeIn";
                podcastEpisode.classPlayButton="";
                setTimeout(function(){
                    self.$setState(podcastEpisode);
                }, 500);
                
                
            }
        break;
    }
}

function loadComedianData(self, context){
    var userAPPID=$$("input[name='userAPPID']").val();
    
    if(appID!==null && appID!==""){
        //load Ajax based comedian info
        
        if(localStorage.getItem("userAPPInfo")!==null){
            var simpleComedian=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(simpleComedian)!=="undefined"){
                if(localStorage.getItem("userAPPLoggedIn")!==null){
                    userAPPID=localStorage.getItem("userAPPLoggedIn");
                }
            }
        }
        
        
        var postData={context: context, appid: appID, userappid: userAPPID};
        if(arguments[2]){
            postData["count"]=arguments[2];
        }
        if(arguments[3]){
            postData["id"]=arguments[3];
        }
        if(arguments[4]){
            switch(arguments[4]){
                case "hideAllCurrentPodcastItems":
                    $$("div#wrapPodcasts").activatedOneByOne(".singleItem", "fadeOutLeft", "fadeInRight fadeOutLeft");
                break;
            }
        }
        if($$("[data-target='load-more-btn']").length>0){
           $$("[data-target='load-more-btn']").removeClass("activated fadeIn");
        }
        
        
        app.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    var obj={};
                    var results=data["results"];
                    switch(context){
                        default:
                            
                        self.$setState(results);
                        break;
                        case "loadPodcastLogo":
                        self.$setState({
                                imgAPP: results.imgAPP
                            });
                        break;
                    }
                    switch(context){
                        case "loadComedianEvents":
                        case "loadComedianVideos":
                        case "loadComedianNews":
                        case "loadComedianSocial":
                        case "loadComedianGalleries":
                            $$("div.wrapWelcomeComedianIntro").activatedOneByOne(".singleItem", "fadeInUp");
                            setTimeout(function(){
                                app.lazy.create("div.lazy");
                            }, 1000);
                        break;
                        case "loadComedianPodcast":
                        case "loadPodcastEpisodes":
                            $$("div.wrapWelcomeComedianIntro").activatedOneByOne(".singleItem", "fadeInRight");
                            window.setTimeout(function(){
                                $$("[data-target='load-more-btn']").addClass(data["results"]["results1"]["classActivated"]);
                            }, 1000);
                            createDynamicArrayForEpisodes(data["results"]);
                        break;
                    }
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
            );
    }
}

function loadEventGoogleImg(self, id){
    //load Ajax based comedian info
    var postData={context: "loadEventGoogleImg", id: id};
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                var obj={};
                obj["googleimg"]=data["content"];
                obj["googlemapurl"]=data["googlemapurl"];
                self.$setState(obj);
            }else{
                //dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}

function getPodcastEpisodeFromCache(id, flag){
    var allPodcastEpisodes=loadedPodcastEpisodes;
    var singleEpisode=null;
    if(allPodcastEpisodes && allPodcastEpisodes.length>0){
        
        //First check is this key exists
        if(typeof(allPodcastEpisodes[id])!=="undefined"){
            //console.log(allPodcastEpisodes[id]);
            var nextKey=id+1;
            var prevKey=id-1;
            if(id==0){
                prevKey=allPodcastEpisodes.length-1;
            }
            if(id==allPodcastEpisodes.length-1){
                nextKey=0;
            }
            switch(flag){
                case "next":
                    singleEpisode=allPodcastEpisodes[nextKey];
                break;
                case "prev":
                    singleEpisode=allPodcastEpisodes[prevKey];
                break;
            }
            
        }
    }
    return singleEpisode;
}

function createDynamicArrayForEpisodes(data){
    loadedPodcastEpisodes=new Array();
    if(data['results1']){
        var results1=data["results1"];
        var id=results1.id;
        if(results1["results"]){
            loadedPodcastEpisodes=results1["results"];
        }
    }
}

function loadEventPerformingComedians(self, id){
    //load Ajax based comedian info
    var postData={context: "loadEventPerformingComedians", id: id};
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                var obj={};
                obj["ifperformingAnimation"]="fadeInUp";
                obj["performing"]=data["results"];
                obj["performingnot"]=data["resultsnot"];
                self.$setState(obj);
            }else{
                //dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}


// Create dynamic Popup
var dynamicPopup = app.popup.create({
  content: '<div class="popup">'+
              '<div class="block">'+
                '<div id="popupContent">Popup created dynamically.</div>'+
                '<p><a href="#" class="link popup-close">Close me</a></p>'+
              '</div>'+
            '</div>',
  // Events
  on: {
    'open-custom': function (payload) {
        this.$el.find("#popupContent").html(payload);
        this.open();
    }
  }
});

function sendAjaxOnFly(postData, form, obj){
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                if(data["silent"]){
                    return false;
                }
                switch(postData["context"]){
                    case "wrapProvinceSBForCountry":
                        var results=data["results"];
                        results.provincesObject=results;
                        obj.$setState(results);
                    break;
                    case "rsvpEvent":
                        var currentRow=obj.closest(".singleItem");
                        currentRow.addClass("wrap-rsvped");
                        app.swipeout.close(currentRow);
                    break;
                }
            }else{
                if(data["silent"]){
                    return false;
                }
                dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function getAddress (latitude, longitude) {
  Framework7.request.promise.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_MAPS_STATIC_V3_API_KEY)
  .then(
    function success (response) {
      currentLocation=getLocationParameters(JSON.parse(response));
      loadComedian();
    },
    function fail (status) {
      console.log('Request failed.  Returned status of',
                  status)
    }
   )
}

function getLocationParameters(obj){
    var a={};
    if(obj.status=="OK" && obj.results){
        for (var ac = 0; ac < obj.results[0].address_components.length; ac++) {
            var component = obj.results[0].address_components[ac];

            switch(component.types[0]) {
                case 'locality':
                    a.userappcity = component.long_name;
                    break;
                case 'administrative_area_level_1':
                    a.userappprovincename = component.short_name;
                    break;
                case 'country':
                    a.userappcountryname = component.long_name;
                    a.userappcountryname_iso_code = component.short_name;
                    break;
            }
        }
    }
    return a;
}

function displayAllRecords(data, template){
    var content="";
    if(data){
        Object.keys(data).forEach(function(i) {
            var obj=data[i];
        //$$.each(data, function(i, obj){
            content +=wrapSingleRecordWithData(obj, template);
        });
    }else{
        content +=template;
    }
    return content;
}

function wrapSingleRecordWithData(data, template){
    var regex=/{{((\w+|\-))}}/g;
    var content="";
    var newTemplate=template.replace(regex, function(a, b){
        var tempContent="";
        if(b=="wrapsublisthere" && typeof(data["results"])!="undefined" && !$.isEmptyObject(data["results"]) && typeof(data["content"])!="undefined" && !$.isEmptyObject(data["content"])){
            tempContent +=displayAllRecords(data["results"], data["content"]);
        }
        
        tempContent +=typeof(data[b])!=="undefined"?data[b]:"";
        return tempContent;
        
    });
    content +=newTemplate;
    return content;
}

function getFileNameFromFullPath(fullPath){
    var filename = fullPath.replace(/^.*[\\\/]/, '');
    var name = filename.substr(0, filename.lastIndexOf('.'));
    return name;
}

function checkForFirstTime(etype, self){
    var showFNotification=false;
    
    if(localStorage.getItem("userAPPFirstTime")!==null){
        var allClicked=JSON.parse(localStorage.getItem("userAPPFirstTime"));
        if(typeof(allClicked)==="object"){
            if(typeof(allClicked[etype])==="undefined"){
                showFNotification=true;
            }
        }else{
            showFNotification=true;
        }
    }else{
        showFNotification=true;
    }
    if(showFNotification){
        self.$setState({
            classFirstTimeActivated: "activated"
        });
    }
}

function firstTimeNotificationGot(etype, self){
    var tempObject=new Array();
    tempObject[etype]=1;
    if(localStorage.getItem("userAPPFirstTime")!==null){

        var allClicks=JSON.parse(localStorage.getItem("userAPPFirstTime"));
        if(typeof(allClicks)==="object"){
            allClicks[etype]=1;
            localStorage.setItem("userAPPFirstTime", totalStringify(allClicks));
        }
    }else{
        localStorage.setItem("userAPPFirstTime", totalStringify(tempObject));
    }
    self.$setState({
        classFirstTimeActivated: ""
    });
}

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}

function totalStringify(data){
    var str=JSON.stringify(data);
    str = str.escapeSpecialChars();
    return str;
}

 String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
};

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

// Returns if a value is an object
function isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function stopAllActivePlayers(i){
    $$("div.wrapPlayer").each(function(){
        var $this=$$(this);
        var currentIndex=$this.closest(".singleItem").index();
        var controls=$this.find("div.wrap-custom-player-controls");
        var btn=controls.find("div.buttons");
        var player=$this.find("audio")[0];
        if(player.readyState!=0){
            player.pause();
            if(currentIndex!=i){
                player.currentTime=0;
            }
            btn.removeClass('paused');
        }
    });
}

function autoBufferPlayer(player, progressBar) {
    player.preload = "auto";
    player.load();
    
    player.addEventListener("progress", function(){
       updateLoadProgress(player, progressBar); 
    });
    
    player.addEventListener("loadeddata", function(){
       updateLoadProgress(player, progressBar); 
    });
    
    player.addEventListener("canplaythrough", function(){
       updateLoadProgress(player, progressBar); 
    });
    
    player.addEventListener("playing", function(){
       updateLoadProgress(player, progressBar); 
    });
    
};

function updateLoadProgress(player, progressBar){
    if(player.buffered.length>0){
        var percent = (player.buffered.end(0) / player.duration) * 100;
        progressBar.css({width: percent + "%"});
    }
}


function initProgressBar(obj) {
    var player = obj;
    var length = player.duration
    var current_time = player.currentTime;

    // calculate total length of value
    var totalLength = calculateTotalValue(length);

    // calculate current value time
    var currentTime = calculateCurrentValue(current_time);
    
    var currentProgress=((player.currentTime / player.duration) * 1000);
    
    var rangeSlider = app.range.get('.range-slider');
    

    var btn=$$(obj).closest("div.wrapPlayer").find("div.buttons-play");
    if(currentProgress>0.2){
        btn.removeClass("preloader-in-act");
    }
    if(player.readyState>0&&player.readyState<4){
            btn.addClass("preloader-in-act");
      }
      else{
            btn.removeClass("preloader-in-act");
      }
    
    if(rangeSlider){
        rangeSlider.setValue(currentProgress);
    }
    

    if (player.currentTime == player.duration) {
        btn.removeClass('paused');
        if(rangeSlider){
            rangeSlider.setValue(0);
        }
    }

    
};

function seek(value, player) {
        var percent = value;
        player.currentTime = percent * player.duration;
        //rangeSlider.setValue(percent * 1000);
    }

function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
  var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}

function wrapSBOptions(a, b){
    var content="";
    if(a.length>0){
        if(b){
            content +='<option value="">' + b + '</option>';
        }
        for(var i in a){
            content +='<option value="' + i + '">' + a[i] + '</option>';
        }
    }
    return content;
}

function isValidDate(day, month, year) {
    var date = new Date();
  
    day=parseInt(day);
    month=parseInt(month);
    year=parseInt(year);
  
    date.setFullYear(year, month - 1, day);

    console.log(day + "/" + month + "/" + year);
    console.log(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
    
    if ( (date.getFullYear() == year) && (date.getMonth() == month - 1 ) && (date.getDate() == day) ){
      if(!checkIsValidRealDate(day, month, year)){
          return false;
      }
      return true;
    }
    return false;
}

function leapYear(year){
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
            var context = this, args = arguments;
            var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
    };
};

function checkIsValidRealDate(day, month, year){
    //Check is this a valid date, ie. prevent February 30, or June 31
     
      //Check for February 30
      if(month==2){
          if(day>29){
              return false;
          }
          //Check for leap year
          if(day==29){
              if(!leapYear(year)){
                  return false;
              }
          }
      }
      //Check are the months with 31 or 30 days
      var month31=new Array(1, 3, 5, 7, 8, 10, 12);
      if(day==31){
          if(month31.indexOf(month)==-1){
              return false;
          }
      }
      return true;
}

class Test {
  rangeListener(range, options) {
    /*
     * This flag will be set to true when we are waiting
     * for the next AnimationFrame, and back to false
     */
    let throttling = false;
    let timer;

    /*
     * Functions
     */
    const changeListener = () => {
      if (!options.onChange) return;
      options.onChange(range.value);
    };

    const stepListener = () => {
      if (!options.onStep || throttling) return;
      throttling = true;

      window.requestAnimationFrame(() => {
        options.onStep(range.value);
        throttling = false;
      });
    };

    const intervalFunc = (isInitialization = false) => {
      if (!options.onInterval) return;
      options.onInterval(range.value);
      if (!isInitialization) {
        timer = setTimeout(intervalFunc, options.delay || 500);
      }
    };

    /*
     * Event listeners
     */
    range.addEventListener("change", changeListener);

    range.addEventListener("mousedown", () => {
      clearTimeout(timer);
      intervalFunc();
      stepListener();
      range.addEventListener("mousemove", stepListener);
    });

    range.addEventListener("mouseup", () => {
      // Execute it once more to get the last value
      intervalFunc();
      clearTimeout(timer);
      range.removeEventListener("mousemove", stepListener);
    });

    range.addEventListener("keydown", stepListener);

    /*
     * Values initialization
     */
    changeListener();
    stepListener();
    intervalFunc(true);
  }
}

function openAllLinksWithBlankTargetInSystemBrowser() {
    if ( typeof cordova === "undefined" || !cordova.InAppBrowser ) {
        throw new Error("You are trying to run this code for a non-cordova project, " +
                "or did not install the cordova InAppBrowser plugin");
    }

    // Currently (for retrocompatibility reasons) the plugin automagically wrap window.open
    // We don't want the plugin to always be run: we want to call it explicitly when needed
    // See https://issues.apache.org/jira/browse/CB-9573
    delete window.open; // scary, but it just sets back to the default window.open behavior
    var windowOpen = window.open; // Yes it is not deleted !
    
    var options='usewkwebview=yes';

    // Note it does not take a target!
    var systemOpen = function(url, options) {
        // Do not use window.open becaus the InAppBrowser open will not proxy window.open
        // in the future versions of the plugin (see doc) so it is safer to call InAppBrowser.open directly
        cordova.InAppBrowser.open(url,"_system",options);
    };


    // Handle direct calls like window.open("url","_blank")
    window.open = function(url,target,options) {
        if ( target == "_blank" ) systemOpen(url,options);
        else windowOpen(url,target,options);
    };

    // Handle html links like <a href="url" target="_blank">
    // See https://issues.apache.org/jira/browse/CB-6747
    $(document).on('click', 'a[target=_blank]', function(event) {
        event.preventDefault();
        systemOpen($(this).attr('href'));
    });
}
  
function togglePlay(player, self) {
      if (player.paused === false) {
          player.pause();
          self.$setState({
              classPlayButton: ""
          });

      } else {
         //stopAllActivePlayers(currentIndex);
         //audioLoad();
          player.play();
          self.$setState({
              classPlayButton: "paused"
          });
      }
  }
  
  function setupGeoLocation(){
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);  
      
    
  
  }
  
  var onGeolocationSuccess = function(position) {
        var latitude=position.coords.latitude;
        var longitude=position.coords.longitude;

         app.request.promise.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_MAPS_STATIC_V3_API_KEY)
         .then(
        function success (response) {
          currentLocation=getLocationParameters(JSON.parse(response));
          currentLocation.classInitHidden="";
          localStorage.setItem("currentLocation", totalStringify(currentLocation));
        },
        function fail (status) {
          console.log('Request failed.  Returned status of',
                      status);
        }
       );
    };

// onError Callback receives a PositionError object
//
function onGeolocationError(error) {
    console.log("navigator.geolocation.getCurrentPosition - Error");
}


function setupGeoLocation1(){
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude=position.coords.latitude;
                var longitude=position.coords.longitude;

                 app.request.promise.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_MAPS_STATIC_V3_API_KEY)
      .then(
        function success (response) {
          currentLocation=getLocationParameters(JSON.parse(response));
          currentLocation.classInitHidden="";
          localStorage.setItem("currentLocation", totalStringify(currentLocation));
        },
        function fail (status) {
          console.log('Request failed.  Returned status of',
                      status);
        }
       );

            }, function(){
                console.log("navigator.geolocation.getCurrentPosition - Error");
            });
  }
  
  function setupPushInit(){
    var push = PushNotification.init({
       "android": {},
       "ios": {
         "sound": true,
         "alert": true,
         "badge": true
       },
       "windows": {}
   });
   
   push.on('error', function(e) {
       console.log("push error = " + e.message);
   });
   
   push.on('notification', function(data) {
         console.log('notification event');
         navigator.notification.alert(
             data.message,         // message
             null,                 // callback
             data.title,           // title
             'Ok'                  // buttonName
         );
     });
}