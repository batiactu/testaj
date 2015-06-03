$(document).ready(function(){$("body").on("click",".navbar-collapse a",function(){var a=$(this);a.closest(".navbar-collapse").collapse("hide")})}),angular.module("webStorage",["logs"]).factory("webStorage",["logs",function(a){var b={set:function(a,b){console.log("WEBSTORAGE SET : ",b),localStorage.setItem(a,JSON.stringify(b))},get:function(a){var b=localStorage.getItem(a);if(void 0==b||null==b)return null;var c=null;try{c=JSON.parse(b)}catch(d){}return c},clearAll:function(){console.log("CLEAR LOCALSTORAGE"),localStorage.clear()},getQty:function(){var a=0;return angular.forEach(localStorage,function(b){a+=b.length}),a}};return b}]),angular.module("synchro",["webStorage","logs"]).factory("synchro",["webStorage","$q","logs",function(a,b,c){var d={listeSynchro:[],dateSynchro:0,config:null,setConfig:function(a){this.config=a},isStorageEnable:function(){return this.isActive()&&1==this.config.synchro.storageEnable&&"string"==typeof this.config.synchro.storageType},init:function(a){console.log("INIT ! ");var b=this;"undefined"!=typeof a&&(b.config=a),b.isActive()&&angular.forEach(b.config.synchro.links,function(a){var c=null;if(console.log("value.name :",a.name),null==c){console.log("Appel du call back == ",a.name);var d=a.callback(a);b.listeSynchro[a.name]=d,b.isStorageEnable()&&void 0!=d&&(void 0==a.specificStorage||1!=a.specificStorage)&&(b.storageSet(a.name,d,!0),void 0!=a.setTimeSynchro&&0!=a.setTimeSynchro&&(b.dateSynchro=Date.now()/1e3|0,b.timeSynchro=a.setTimeSynchro))}})},storageSet:function(b,c,d){"undefined"==typeof d&&(d=!0);var e=this;switch(this.config.synchro.storageType){case"W":console.log("Stockage clé : ",d,b,c),d?c.then(function(c){a.set(b,c)}):a.set(b,c);break;case"P":console.log("Storage PHONE",e.config.synchro)}},storageGet:function(b){var c=this;switch(c.config.synchro.storageType){case"W":return a.get(b);case"P":console.log("Storage PHONE",c.config.synchro)}},storageClearAll:function(){var b=this;switch(b.config.synchro.storageType){case"W":return a.clearAll();case"P":console.log("ClearAll PHONE",b.config.synchro)}},storageQty:function(){var b=this;switch(b.config.synchro.storageType){case"W":return a.getQty();case"P":console.log("getQTY PHONE",b.config.synchro)}},isActive:function(){return null==this.config||"undefined"==typeof this.config.synchro||"undefined"==typeof this.config.synchro.enabled||1!=this.config.synchro.enabled||"undefined"==typeof this.config.synchro.links||0==this.config.synchro.links.length?!1:!0},getConf:function(a){if(this.isStorageEnable()){var b=this.storageGet("conf_"+a);return b}},get:function(a,b){var c=this;if(console.log(a+" --------------------------> "+b+" ------++++> ",c.listeSynchro[a]),"undefined"!=typeof c.listeSynchro[a]&&null!=c.listeSynchro[a])return c.listeSynchro[a];if(c.isStorageEnable()){var d=c.storageGet(a);if("undefined"!=typeof d&&null!=d){void 0!=b&&void 0!=d[b]&&(d=d[b].obj);var e=c.getPromise(d);return c.listeSynchro[a]=e,e}}return null},getPromise:function(a){var c=b.defer();return c.resolve(a),c.promise},setConf:function(a,b){if(this.isStorageEnable()){this.storageSet("conf_"+a,b,!1)}},set:function(a,b,c){var d,e;if(void 0!=c){void 0==c.promise?(d=this.getPromise(c),e=c):(d=c.promise,e=c.obj),void 0==this.listeSynchro[a]&&(this.listeSynchro[a]=[]),this.listeSynchro[a][b]=d;var f=this.storageGet(a);null==f&&(f=[]),void 0==f&&(f=[]),f[b]=e,this.storageSet(a,f,!1)}else void 0==b.promise?(d=this.getPromise(b),e=b):(d=b.promise,e=b.obj),this.listeSynchro[a]=d,this.storageSet(a,e,!1)},clearAll:function(){this.storageClearAll(),this.listeSynchro=[]},checkTimeout:function(){return 0!=this.dateSynchro&&0!=this.timeSynchro?(c.info("Message !!!!"),(Date.now()/100|0)-this.dateSynchro>this.timeSynchro):!1},getStockageQty:function(){var a={stockage:0,memoire:0,espaceNote:0};return a.stockage=this.storageQty(),a},reSync:function(){null!=(login=this.storageGet("login"))?(console.log("RESYNCHHHHRRROOOOO ::::: ",login),this.clearAll(),this.storageSet("login",login,!1),console.log("login")):this.clearAll(),console.log("RESYNCHHHHRRROOOOO ::::: INIT "),this.init()}};return d}]),angular.module("logs",["ngRoute"]).config(["$routeProvider",function(a){console.log("Add logs route"),a.when("/logs",{templateUrl:"views/logs.html",controller:"LogsCtrl"})}]).controller("LogsCtrl",["$scope","logs",function(a,b){a.logs=b}]).factory("logs",["$rootScope",function(a){var b={active:!1,logList:[],activate:function(){console.log("Logs activated"),this.active=!0},unactivate:function(){this.active=!1,console.log("Logs non activated")},log:function(a,b){if(this.active){var c=Date.now()/1e3|0;this.logList.push({date:c,type:a,message:b})}},error:function(a){this.log("ERROR",a)},info:function(a){this.log("INFO",a)},warning:function(a){this.log("WARN",a)}};return b}]),angular.module("phonegapModule",[]).factory("baPhoneGap",function(){var a={connected:!1,mediaRec:null,isDevice:function(){return"object"==typeof window.cordova?(console.log("C'EST UN DEVICE"),!0):(console.log("CE N'EST PAS UN DEVICE"),!1)},deviceReady:function(a){"object"==typeof window.cordova?(console.log("cordova == object"),document.addEventListener("deviceready",function(){console.log("DANS DEVCEREADY"),a()},!1)):console.log("DAS DE  deviceready")},isConnected:function(){var a=this;return this.deviceReady(function(){a.connected=!0}),console.log("Est connecté : ",a.connected),a.connected},litAudio:function(){var a=this;a.mediaRec.play()},captureAudio1:function(){var a=this;return this.deviceReady(function(){console.log("Audio "),navigator.device.capture.captureAudio(function(b){console.log("Audio ",b),$("#capturedVideo, #capturedImg").hide(),$("#capturedAudio").show(),$("#capturedAudio").attr("controls","controls"),a.loadMedia(b,"#capturedAudio")},a.errorHandler,{limit:1,duration:10})}),!1},captureAudio:function(){var a=this,b="/android_asset/www/test.wav";return a.mediaRec=new Media(b,function(){console.log("recordAudio():Audio Success")},function(a){console.log("recordAudio():Audio Error: "+a.code)},function(a){console.log("recordAudio():Audio Status: ",a)}),a.mediaRec.startRecord(),setTimeout(function(){a.mediaRec.stopRecord()},1e4),a.mediaRec},captureImage:function(){var a=this;return this.deviceReady(function(){navigator.device.capture.captureImage(function(b){console.log(b),a.loadMedia(b,"#capturedImage"),a.tranfert(b[0])},a.errorHandler)}),!1},loadMedia:function(a,b){var c,d,e;for(c=0,e=a.length;e>c;c+=1)d=a[c].fullPath,$(b).attr("src",d)},errorHandler:function(a){console.log("Error : ",a)},tranfert:function(a){var b=new FileTransfer,c=a.fullPath,d=a.name;b.upload(c,"http://192.168.3.103/appli_mobile_chiffrage/php/upload.php",function(a){console.log("Upload success: "+a.responseCode),console.log(a.bytesSent+" bytes sent")},function(a){console.log(a),console.log("Error uploading file "+c+": "+a.code)},{fileName:d})},checkConnection:function(){if(!this.isDevice())return{state:1,label:"Connexion WEB"};var a=navigator.network.connection.type,b={};return b[Connection.UNKNOWN]={state:1,label:"Unknown connection"},b[Connection.ETHERNET]={state:1,label:"Ethernet connection"},b[Connection.WIFI]={state:1,label:"WiFi connection"},b[Connection.CELL_2G]={state:1,label:"Cell 2G connection"},b[Connection.CELL_3G]={state:1,label:"Cell 3G connection"},b[Connection.CELL_4G]={state:1,label:"Cell 4G connection"},b[Connection.NONE]={state:0,label:"No network connection"},b[a]},onSuccessFileSystem:function(a){console.log("***test: fileSystem.root.name: ",a);var b="myRecording100.wav",c=a.root.getFile(b,{create:!0,exclusive:!1},function(a){console.log(a),mediaRec=new Media(a.fullPath,function(){console.log("***test: new Media() succeeded ***")},function(a){console.log("***test: new Media() failed ***",a)}),console.log(mediaRec),mediaRec.startRecord(),setTimeout(function(){mediaRec.stopRecord()},1e4)},function(a){console.log("erreur : ",a)});console.log("result ",c)},checkMediaRecFileExist:function(){window.requestFileSystem(LocalFileSystem.PERSISTENT,0,this.onSuccessFileSystem,null)},onOK_GetFile:function(a){console.log(a);var b="myRecording100.wav";console.log("***test: File "+b+" at "+a.fullPath);var c=a.fullPath;mediaRec=new Media(c,function(){console.log("***test: new Media() succeeded ***")},function(a){console.log("***test: new Media() failed ***",a)}),console.log(mediaRec)}};return a}),angular.module("appliMobileBatiChiffrageApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","angular.filter","synchro","logs","phonegapModule"]).value("configSite",{profile:{authentificated:!1,UId:""},msgError:!1,synchro:{enabled:!0,links:[],storageEnable:!0,storageType:"W"},UrlBC:"chiffrage.batiactu.com"}).run(["$rootScope","configSite","ProjetsFactory","ClientsFactory","LoginFactory","synchro","logs","baPhoneGap","$interval",function(a,b,c,d,e,f,g,h,i){var j="";"object"==typeof window.cordova&&(j="http://192.168.3.103/appli_mobile_chiffrage/app/"),j="",a.filter={},a.config=b,a.SynchroStatus={listeProjets:!1,detailProjet:[],detailProjetFourniture:[],detailClient:[],listeClients:!1},b.urlDebug=j,b.synchro.links.push({name:"listeProjets",callback:c.getSynchoListeProjets,checkIfSync:!0,setTimeSynchro:1e3}),b.synchro.links.push({name:"listeDetailProjets",callback:c.getSynchoListeDetailProjets,specificStorage:!0}),b.synchro.links.push({name:"listeClients",callback:d.getSynchoListeClients}),f.setConfig(b),f.getStockageQty();var k=f.get("login");null!=k&&k.then(function(a){1==a.hasAbo&&(e.setProfile(a),console.log("LOGIN présent on resynchronise ?"),h.isDevice()?h.isConnected()?(console.log("Appli mobile et connecté on synchronise"),f.reSync()):i(function(){if(0==h.connected&&h.isConnected())console.log("RESYNCHRO MINUTE");else{var a=h.isConnected();console.log(a?"Connecté":"non Connecté")}},6e4):(console.log("Appli Web on synchronise"),f.reSync(),i(function(){console.log("Info minute -- check if connected (fake : Web)")},6e4)))})}]).config(["$routeProvider","$sceDelegateProvider",function(a,b){var c="";"object"==typeof window.cordova&&(c="http://192.168.3.103/appli_mobile_chiffrage/app/"),c="",b.resourceUrlWhitelist(["self","http://192.168.3.103/appli_mobile_chiffrage/app/**"]),a.when("/",{templateUrl:c+"views/login.html",controller:"LoginCtrl"}).when("/main",{templateUrl:c+"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:c+"views/about.html",controller:"AboutCtrl"}).when("/myroute",{templateUrl:c+"views/myroute.html",controller:"MyrouteCtrl"}).when("/projet/:PrId",{templateUrl:c+"views/projet.html",controller:"ProjetCtrl"}).when("/projets",{templateUrl:c+"views/projets.html",controller:"ProjetsCtrl"}).when("/fournitures/:PrId",{templateUrl:c+"views/fournitures.html",controller:"FournituresCtrl"}).when("/paramprojet/:PrId",{templateUrl:c+"views/paramprojet.html",controller:"ParamprojetCtrl"}).when("/moprojet/:PrId",{templateUrl:"views/moprojet.html",controller:"ParamprojetCtrl"}).when("/clients",{templateUrl:c+"views/clients.html",controller:"ClientsCtrl"}).when("/client/:GCId",{templateUrl:c+"views/client.html",controller:"ClientCtrl"}).when("/chiffrage",{templateUrl:c+"views/chiffrage.html",controller:"ChiffrageCtrl"}).when("/contact",{templateUrl:c+"views/contact.html",controller:"ContactCtrl"}).when("/logout",{templateUrl:c+"views/logout.html",controller:"LogOutCtrl"}).when("/settings",{templateUrl:c+"views/settings.html",controller:"SettingsCtrl"}).when("/device",{templateUrl:c+"views/device.html",controller:"testdeviceCtrl"}).when("/code",{templateUrl:c+"views/code.html",controller:"CodeCtrl"}).when("/editions/:PrId",{templateUrl:c+"views/editions.html",controller:"EditionsCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("appliMobileBatiChiffrageApp").factory("ProjetsFactory",["synchro","configSite","$http","$q","$rootScope","ClientsFactory",function(a,b,c,d,e,f){var g={projectList:!1,nbDetailToSynchronize:5,getSynchoListeProjets:function(a){var e=d.defer(),f="http://"+b.UrlBC+"/scripts/interfaceEL.php?mode=GET_PROJETS_FAVORIS_CLIENT&UId="+b.profile.UId+"&order=ORDER+BY+p.dt_maj+DESC%2Cp.dt_cre+DESC%2Cp.id+DESC&filtre_mask_etat=";return c.post(f).success(function(a,b){g.projectList=a,e.resolve(g.projectList)}).error(function(a,b){console.log(a),console.log(b)}),e.promise},getSynchoListeDetailProjets:function(b){var c=a.get("listeProjets");return null==c?null:void c.then(function(b){e.SynchroStatus.listeProjets=!0;var c=g.nbDetailToSynchronize;b.length<g.nbDetailToSynchronize&&(c=b.length);for(var d=0;c>d;d++){{var f=a.get(b[d].PrId);Date.now()/1e3|0}null==f&&(g.getSynchoDetailProjets(b[d].PrId),g.getSynchroFourniture(b[d].PrId))}})},getSynchroFourniture:function(f){var g=d.defer(),h="http://"+b.UrlBC+"/scripts/interfaceEL.php?mode=GET_LISTE_COMPOS&PrId="+f;c.post(h).success(function(a){g.resolve(a)}),a.set("F-"+f,{promise:g.promise,obj:{}}),g.promise.then(function(b){e.SynchroStatus.detailProjetFourniture["F-"+f]=!0,a.set("F-"+f,{promise:g.promise,obj:b})})},getSynchoDetailProjets:function(g){var h=d.defer(),i="http://"+b.UrlBC+"/scripts/interfaceEL.php?mode=GET_PROJET&fonction=loadProjet&async=false&PrId="+g;c.post(i).success(function(a,b){h.resolve(a)}),a.set(g,{promise:h.promise,obj:{}}),h.promise.then(function(b){e.SynchroStatus.detailProjet[b.PrId]=!0,a.set(b.PrId,{promise:h.promise,obj:b}),""!=b.GCId&&f.getSynchroClient(b.GCId)})},isProjectSynchronized:function(b){if(!a.isActive())return"";var c=e.SynchroStatus.detailProjet[b];return void 0!=c&&1==c?"S":""},getListeProjets:function(){var b=a.get("listeProjets");return null!=b?b:null},getProjet:function(b){var c=a.get(b);return null==c&&(this.getSynchoDetailProjets(b),c=a.get(b)),c},getFourniture:function(b){var c="F-"+b,d=a.get(c);return null==d&&(this.getSynchroFourniture(b),d=a.get(c)),d},getFourniture:function(b){var c="F-"+b,d=a.get(c);return null==d&&(this.getSynchroFourniture(b),d=a.get(c)),d}};return g}]),angular.module("appliMobileBatiChiffrageApp").factory("ClientsFactory",["synchro","configSite","$http","$q","$rootScope",function(a,b,c,d,e){var f={customerList:!1,getSynchoListeClients:function(a){var e=d.defer();console.log("J'APPELLE LE WS");var g="http://"+b.UrlBC+"/scripts/interfaceEL.php?mode=GET_LISTE_GCLIENTS&UId="+b.profile.UId+"&type=CLIENT&order=ORDER+BY+nom+ASC%2C+dt_cre+DESC%2C+id+DESC&IDX";return c.post(g).success(function(a,b){f.customerList=a,e.resolve(f.customerList)}),e.promise},getSynchroClient:function(f){var g=d.defer(),h="http://"+b.UrlBC+"/scripts/interfaceEL.php?mode=GET_GCLIENT&fonction=loadGClient&async=false&GCId="+f;c.post(h).success(function(a){g.resolve(a)}),a.set(f,{promise:g.promise,obj:{}}),g.promise.then(function(b){e.SynchroStatus.detailClient[f]=!0,a.set(f,{promise:g.promise,obj:b})})},getListeClients:function(){var b=a.get("listeClients");return null!=b?b:null},getClient:function(b){var c=a.get(b);return null==c&&(this.getSynchroClient(b),c=a.get(b)),c}};return f}]),angular.module("appliMobileBatiChiffrageApp").factory("LoginFactory",["synchro","configSite","$http","$q","$rootScope",function(a,b,c,d,e){var f={getSynchoLogin:function(){return null},getNbAbo:function(c){return console.log("########### Liste des Abo",c[0]),console.log("########## count abo",c.length),0==c.length?(b.profile.hasAbo=!1,a.set("login",b.profile),!1):(b.profile.hasAbo=!0,a.set("login",b.profile),!0)},mustLog:function(){var a=0==b.profile.authentificated||0==b.profile.hasAbo;return a&&console.log("go Login"),a},setProfile:function(c){b.profile.authentificated=c.authentificated,b.profile.UId=c.UId,b.profile.nom=c.nom?c.nom:"",b.profile.prenom=c.prenom?c.prenom:"",b.profile.abonnement=c.abonnement?c.abonnement:"",b.profile.hasAbo=c.hasAbo?c.hasAbo:!1,a.set("login",b.profile)}};return f}]),angular.module("appliMobileBatiChiffrageApp").factory("SettingsFactory",["synchro",function(a){var b={getStockageQty:function(){return a.getStockageQty()}};return b}]),angular.module("appliMobileBatiChiffrageApp").filter("formatPrix",function(){return function(a){return(Math.round(100*a)/100).toFixed(2).replace(".",",")}}).filter("NettoyagePhoneNumber",function(){return function(a){if("undefined"!=typeof a){var b=new RegExp("[-._/*() ]","g");return a=a.replace(b,"")}}}).filter("formatPhoneNumber",function(){return function(a){if("undefined"!=typeof a){if("+"==a.substr(0,1))return a;if("00"==a.substr(0,2))return a.replace(a.substr(0,2),"+");if("0"==a.substr(0,1))return a.replace(a.substr(0,1),"+33")}}}).filter("AffPhoneNumber",function(){return function(a){if("undefined"!=typeof a){if("+33"==a.substr(0,3)){a=a.replace(a.substr(0,3),"0");var b=a.match(/.{2}/g);a=b.join(" ")}return a}}}).filter("tauxtva",function(){return function(a){var b=100*(a-1);return(Math.round(100*b)/100).toFixed(2).replace(".",",")}}).filter("formatNumber2chiffres",function(){return function(a){return(Math.round(100*a)/100).toFixed(2).replace(".",",")}}).filter("replacePointParVirgule",function(){return function(a){return String(a).replace(".",",")}}).filter("formatDatemdY",function(){return function(a){var b=String(a).split(" "),c=b[0].split("-");return c[2]+"/"+c[1]+"/"+c[0]}}),angular.module("appliMobileBatiChiffrageApp").controller("MainCtrl",["$scope","$rootScope","$http","$location","ProjetsFactory","ClientsFactory","configSite","LoginFactory",function(a,b,c,d,e,f,g,h){if(a.projets=!1,a.clients=!1,h.mustLog())g.msgError=!1,d.path("login");else{var i=e.getListeProjets();console.log("MAIN : ",i),null!=i&&i.then(function(b){a.projets=b;var c=b.length;c>5?a.countProj=5:a.countProj=c});var j=f.getListeClients();null!=j&&j.then(function(b){a.clients=b.liste;var c=b.liste.length;c>5?a.countClient=5:a.countClient=c});var k=window.location.hash.split("/")[1],l=k.substring(k.length-1,k.length);"s"!=l&&(k+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+k).addClass("active")}}]),angular.module("appliMobileBatiChiffrageApp").controller("AboutCtrl",["$scope","configSite","logs",function(a,b,c){a.count=0,a.clcl=function(){a.count++,a.count>7&&c.activate()};var d=window.location.hash.split("/")[1],e=d.substring(d.length-1,d.length);"s"!=e&&(d+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+d).addClass("active")}]),angular.module("appliMobileBatiChiffrageApp").controller("ContactCtrl",["$scope","ProjetsFactory",function(a,b){console.log(localStorage);var c=window.location.hash.split("/")[1],d=c.substring(c.length-1,c.length);"s"!=d&&(c+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+c).addClass("active")}]),angular.module("appliMobileBatiChiffrageApp").controller("ProjetCtrl",["$scope","$rootScope","$http","$location","$routeParams","ProjetsFactory","configSite","LoginFactory",function(a,b,c,d,e,f,g,h){if(a["synchronized"]=!1,h.mustLog())g.msgError=!1,d.path("login");else{a.oneAtATime=!0,a.status={isFirstOpen:!1,isFirstDisabled:!1};var i=f.getProjet(e.PrId);console.log("getProjet :",i),null!=i&&i.then(function(b){if(console.log("datas ----> ",Object.keys(b).length),null!=b&&0!==Object.keys(b).length){a.projet=b,a.lignes=b.TLigne,a.tvas=b.TListeTVA;var c=0;angular.forEach(b.TListeTVA,function(a,b){c+=parseFloat(a.total)}),a.sum=Math.round(100*c)/100,a["synchronized"]=!0}});var j="http://"+g.UrlBC+"/scripts/interfaceEL.php?mode=GET_DOCUMENT_DEVIS&type=FACT&UId="+g.profile.UId+"&PrId="+e.PrId;c.post(j).success(function(b,c){a.doc=b}),a.testLibelle=function(a){return"<NULL>"==a?!1:!0};var k=window.location.hash.split("/")[1],l=k.substring(k.length-1,k.length);"s"!=l&&(k+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+k).addClass("active")}}]),angular.module("appliMobileBatiChiffrageApp").controller("ProjetsCtrl",["$scope","ProjetsFactory","$http","$location","configSite","LoginFactory",function(a,b,c,d,e,f){if(a.projets={},a.ProjetsFactory=b,f.mustLog())e.msgError=!1,d.path("login");else{var g=b.getListeProjets();if(null!=g){g.then(function(b){a.projets=b})}var h=a.projets.length-1;h>5?a.countProj=5:a.countProj=h;var i=window.location.hash.split("/")[1],j=i.substring(i.length-1,i.length);"s"!=j&&(i+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+i).addClass("active")}}]),angular.module("appliMobileBatiChiffrageApp").controller("FournituresCtrl",["$scope","$http","$location","$routeParams","configSite","ProjetsFactory","LoginFactory",function(a,b,c,d,e,f,g){if(g.mustLog())e.msgError=!1,c.path("login");else{var h=f.getFourniture(d.PrId);null!=h&&h.then(function(b){a.fournitures=b});var i=f.getProjet(d.PrId);null!=i&&i.then(function(b){a.projet=b})}}]),angular.module("appliMobileBatiChiffrageApp").controller("ParamprojetCtrl",["$scope","$location","$routeParams","configSite","ProjetsFactory","LoginFactory",function(a,b,c,d,e,f){if(f.mustLog())d.msgError=!1,b.path("login");else{var g=e.getProjet(c.PrId);null!=g&&g.then(function(b){a.projet=b,a.tvas=b.TTauxTVA}),a.calculRemFO=function(a){return a=100-(100*a-77)/.28,Math.round(100*a)/100},a.calculDiffCh=function(a){return a=100-(100*a-90)/.25,Math.round(100*a)/100}}}]),angular.module("appliMobileBatiChiffrageApp").controller("ClientCtrl",["$scope","$http","$location","$routeParams","configSite","ClientsFactory","LoginFactory",function(a,b,c,d,e,f,g){if(g.mustLog())e.msgError=!1,c.path("login");else{var h=f.getClient(d.GCId);null!=h&&h.then(function(b){a.client=b,a.projetsLies=b.TListe_projets_lies,a.countProjetLie=b.TListe_projets_lies.length});var i=window.location.hash.split("/")[1],j=i.substring(i.length-1,i.length);"s"!=j&&(i+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+i).addClass("active")}}]),angular.module("appliMobileBatiChiffrageApp").controller("ClientsCtrl",["$scope","$rootScope","$http","$location","configSite","ClientsFactory","LoginFactory",function(a,b,c,d,e,f,g){if(g.mustLog())e.msgError=!1,d.path("login");else{var h=f.getListeClients();null!=h&&h.then(function(b){a.clients=b.liste});var i=window.location.hash.split("/")[1],j=i.substring(i.length-1,i.length);"s"!=j&&(i+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+i).addClass("active")}}]),angular.module("appliMobileBatiChiffrageApp").controller("ChiffrageCtrl",["$scope","$location","$log",function(a,b,c){a.params=b.search(),a.$log=c;var d=window.location.hash.split("/")[1],e=d.substring(d.length-1,d.length);"s"!=e&&(d+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+d).addClass("active")}]),angular.module("appliMobileBatiChiffrageApp").controller("LoginCtrl",["$scope","$location","$http","configSite","synchro","LoginFactory",function(a,b,c,d,e,f){a.formLogin={},e.setConfig(d);var g=null;console.log("############ PATH ",b.path()),null!=(g=e.get("login"))&&(console.log("LOGIN = ",g),g.then(function(a){if(1==a.hasAbo){if(""==a.UId)return;f.setProfile(a),console.log("MAIN"),b.path("main")}else console.log("Pas de hasAbo : go code"),b.path("code")})),a.formLogin.submitTheForm=function(g,h){var i={email:a.formLogin.email,password:a.formLogin.password},j="http://"+d.UrlBC+"/scripts/interface.php?mode=LOGIN&email="+i.email+"&pass="+i.password+"&cle_cryptage=&siret=&source=";c.post(j).success(function(a,c){'"KO"'!=a?(f.setProfile({authentificated:!0,UId:a.UId,nom:a.user.nom,prenom:a.user.prenom,abonnement:a.user.abonnement}),0==f.getNbAbo(a.TAbonnement)?(console.log("########### REDIRECTION VERS LE CODE"),b.path("code")):(console.log("########### REDIRECTION VERS LE MAIN"),e.init(d),e.set("login",d.profile),b.path("main"))):(d.msgError=!0,b.path("login"))})},a.logout=function(){d.profile.authentificated=!1,d.profile.UId="",d.msgError=!1,e.clearAll(),b.path("login")}}]),angular.module("appliMobileBatiChiffrageApp").controller("LogOutCtrl",["$scope","$location","configSite","synchro",function(a,b,c,d){c.profile.authentificated=!1,c.profile.UId="",c.msgError=!1,d.clearAll(),b.path("login")}]),angular.module("appliMobileBatiChiffrageApp").controller("SettingsCtrl",["$scope","SettingsFactory","baPhoneGap",function(a,b,c){a.stockage=b.getStockageQty(),a.connexion=c.checkConnection()}]),angular.module("appliMobileBatiChiffrageApp").controller("ModalPassOublieCtrl",["$scope","$modal","$log",function(a,b,c){a.animationsEnabled=!0,a.formPassOublie={email:""},a.open=function(){b.open({animation:a.animationsEnabled,templateUrl:"template/modal/ModalPassOublie.html",backdrop:!0,windowClass:"modal",controller:["$scope","$modalInstance","$log","formPassOublie","configSite","$http",function(a,b,c,d,e,f){a.formPassOublie=d,a.msgpw={"class":"",message:""},a.submitPassOublie=function(){var b={email:a.formPassOublie.email};a.msgpw={"class":"",message:""};var c="http://"+e.UrlBC+"/scripts/interface.php?mode=CHECK_EMAIL&email="+b.email;f.post(c).success(function(c,d){if('"!EXIST"'==c)a.msgpw={"class":"alert-danger",message:"L'adresse email saisie n'est pas enregistrée !"};else{var g="http://"+e.UrlBC+"/scripts/interface.php?mode=FORGOT_PASS&email="+b.email;f.post(g).success(function(c,d){'"OK"'==c&&(a.msgpw={"class":"alert-success",message:"Vos identifiants ont bien été envoyés à l'adresse mail\r\n"+b.email})})}})},a.cancel=function(){b.dismiss("cancel")}}],resolve:{formPassOublie:function(){return a.formPassOublie}}})},a.toggleAnimation=function(){a.animationsEnabled=!a.animationsEnabled}}]),angular.module("appliMobileBatiChiffrageApp").controller("ModalTest24Ctrl",["$scope","$modal","$log",function(a,b,c){a.animationsEnabled=!0,a.formTest={societe:"",nom:"",prenom:"",email:"",tel:""},a.open=function(){b.open({animation:a.animationsEnabled,templateUrl:"template/modal/Modal24h.html",backdrop:!0,windowClass:"modal",controller:["$scope","$modalInstance","$log","formTest","configSite","$http","$location","LoginFactory","$timeout",function(a,b,c,d,e,f,g,h,i){a.formTest=d,a.msgtest={"class":"",message:""},a.submitTest=function(){a.msgtest={"class":"",message:""},a.dataObject={societe:a.formTest.societe,nom:a.formTest.nom,prenom:a.formTest.prenom,email:a.formTest.email,tel:a.formTest.tel};var c="http://"+e.UrlBC+"/scripts/interface.php?mode=CHECK_EMAIL&email="+a.dataObject.email;f.post(c).success(function(c,d){if('"EXIST"'==c)a.msgtest={"class":"alert-danger",message:"L'adresse email saisie est déjà enregistrée !"};else{var j="http://"+e.UrlBC+"/scripts/interface.php?mode=SAVE_PROSPECT&source=Mobile&nom="+a.dataObject.societe+"&email="+a.dataObject.email+"&tel1="+a.dataObject.tel+"&MYTLV_nomcontact="+a.dataObject.nom+"&MYTLV_prenomcontact="+a.dataObject.prenom;f.post(j).success(function(c,d){console.log("########### DATA CREATION PROSPECT",c),c.id>0?(h.setProfile({authentificated:!0,UId:c.UId,nom:c.user.nom,prenom:c.user.prenom,abonnement:c.user.abonnement}),0==h.getNbAbo(c.TAbonnement)?(console.log("########### REDIRECTION VERS LE CODE"),a.msgtest={"class":"alert-success",message:"Votre code d'accès vient de vous être envoyé par SMS au "+c.tel1+" et par mail à "+c.email},i(function(){b.dismiss("cancel"),g.path("code")},4e3)):(console.log("########### REDIRECTION VERS LE MAIN"),b.dismiss("cancel"),g.path("main"))):a.msgtest={"class":"alert-danger",message:"Une erreur est survenue lors de la création de votre compte"}})}})},a.cancel=function(){b.dismiss("cancel"),g.path("login")}}],resolve:{formTest:function(){return a.formTest}}})},a.toggleAnimation=function(){a.animationsEnabled=!a.animationsEnabled}}]),angular.module("appliMobileBatiChiffrageApp").controller("CodeCtrl",["$scope","$location","configSite","synchro","$http","LoginFactory",function(a,b,c,d,e,f){a.formCode={code:""},a.msgcode={"class":"",message:""},a.submitCode=function(){a.msgcode={"class":"",message:""},console.log("########### SUBMIT CODE");var d={code:a.formCode.code},g="http://"+c.UrlBC+"/scripts/interface.php?mode=CHECK_CODE_MOBILE&code="+d.code+"&UId="+c.profile.UId;e.post(g).success(function(c,d){console.log("################ USER : ",c),f.getNbAbo(c.TAbonnement)?b.path("main"):a.msgcode={"class":"alert-danger",message:"Mauvais erroné"}})}}]),angular.module("appliMobileBatiChiffrageApp").controller("EditionsCtrl",["$scope","ProjetsFactory","$http","$location","configSite","LoginFactory","$routeParams",function(a,b,c,d,e,f,g){a.document={};var h="http://"+e.UrlBC+"/scripts/interfaceEL.php?mode=GET_DOCUMENT_DEVIS&UId="+e.profile.UId+"&PrId="+g.PrId;c.post(h).success(function(b,c){a.document=b})}]),angular.module("appliMobileBatiChiffrageApp").controller("DeviceCtrl",["$scope","configSite","logs","baPhoneGap",function(a,b,c,d){a.message="ok",a.getPhoto=function(){console.log("get photo"),d.captureImage()},a.getAudio=function(){d.captureAudio()},a.litAudio=function(){d.litAudio()};var e=window.location.hash.split("/")[1],f=e.substring(e.length-1,e.length);"s"!=f&&(e+="s"),$("#navbar ul li").removeClass("active"),$("#navbar ul li#"+e).addClass("active")}]);