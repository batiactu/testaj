"use strict";
angular.module("webStorage", []).factory("webStorage", function () {
    var a = {
        set: function (a, b) {
            localStorage.setItem(a, JSON.stringify(b))
        }, get: function (a) {
            var b = localStorage.getItem(a);
            if (void 0 == b || null == b)return null;
            var c = null;
            try {
                c = JSON.parse(b)
            } catch (d) {
                console.log("erreur converrion")
            }
            return c
        }, clearAll: function () {
            localStorage.clear()
        }, getQty: function () {
            var a = 0;
            return angular.forEach(localStorage, function (b) {
                a += b.length
            }), console.log(a), a
        }
    };
    return a
}), angular.module("synchro", ["webStorage", "baLogs"]).factory("synchro", ["webStorage", "$q", "baLogs", function (a, b, c) {
    var d = {
        listeSynchro: [], config: null, dateSynchro: function () {
            return Date.now() / 1e3 | 0
        }, setConfig: function (a) {
            this.config = a
        }, isStorageEnable: function () {
            return this.isActive() && 1 == this.config.synchro.storageEnable && "string" == typeof this.config.synchro.storageType
        }, init: function (a) {
            var b = this;
            "undefined" != typeof a && (b.config = a), b.isActive() && angular.forEach(b.config.synchro.links, function (a) {
                var c = null;
                if (null == c) {
                    var d = a.callback(a);
                    if (b.listeSynchro[a.name] = d, b.isStorageEnable() && void 0 != d && (void 0 == a.specificStorage || 1 != a.specificStorage)) {
                        b.storageSet(a.name, d, !0);
                        var e = b.dateSynchro();
                        b.setConf("lastSynchro", e), void 0 != a.setTimeSynchro && 0 != a.setTimeSynchro && (b.timeSynchro = a.setTimeSynchro)
                    }
                }
            })
        }, resynchronize: function (a, b) {
            var c = this;
            "undefined" != typeof b && (c.config = b), c.isActive() && angular.forEach(c.config.synchro.links, function (b) {
                if (b.name == a) {
                    var d = null;
                    if (null == d) {
                        var e = b.callback(b);
                        if (c.listeSynchro[b.name] = e, c.isStorageEnable() && void 0 != e && (void 0 == b.specificStorage || 1 != b.specificStorage)) {
                            c.storageSet(b.name, e, !0);
                            var f = c.dateSynchro();
                            c.setConf("lastSynchro", f), void 0 != b.setTimeSynchro && 0 != b.setTimeSynchro && (c.timeSynchro = b.setTimeSynchro)
                        }
                    }
                }
            })
        }, storageSet: function (b, c, d) {
            "undefined" == typeof d && (d = !0);
            switch (this.config.synchro.storageType) {
                case"W":
                    d ? c.then(function (c) {
                        a.set(b, c)
                    }) : a.set(b, c);
                    break;
                case"P":
            }
        }, storageGet: function (b) {
            switch (d.config.synchro.storageType) {
                case"W":
                    return a.get(b);
                case"P":
            }
        }, storageClearAll: function () {
            var b = this;
            switch (b.config.synchro.storageType) {
                case"W":
                    return a.clearAll();
                case"P":
            }
        }, storageQty: function () {
            var b = this;
            switch (b.config.synchro.storageType) {
                case"W":
                    return a.getQty();
                case"P":
            }
        }, isActive: function () {
            return null == this.config || "undefined" == typeof this.config.synchro || "undefined" == typeof this.config.synchro.enabled || 1 != this.config.synchro.enabled || "undefined" == typeof this.config.synchro.links || 0 == this.config.synchro.links.length ? !1 : !0
        }, getConf: function (a) {
            if (this.isStorageEnable()) {
                var b = this.storageGet("conf_" + a);
                return b
            }
        }, get: function (a, b) {
            var c = this;
            if ("undefined" != typeof c.listeSynchro[a] && null != c.listeSynchro[a])return c.listeSynchro[a];
            if (c.isStorageEnable()) {
                var d = c.storageGet(a);
                if ("undefined" != typeof d && null != d) {
                    void 0 != b && void 0 != d[b] && (d = d[b].obj);
                    var e = c.getPromise(d);
                    return c.listeSynchro[a] = e, e
                }
            }
            return null
        }, getPromise: function (a) {
            var c = b.defer();
            return c.resolve(a), c.promise
        }, setConf: function (a, b) {
            if (this.isStorageEnable()) {
                this.storageSet("conf_" + a, b, !1)
            }
        }, set: function (a, b, c) {
            var d, e;
            if (void 0 != c) {
                void 0 == c.promise ? (d = this.getPromise(c), e = c) : (d = c.promise, e = c.obj), void 0 == this.listeSynchro[a] && (this.listeSynchro[a] = []), this.listeSynchro[a][b] = d;
                var f = this.storageGet(a);
                null == f && (f = []), void 0 == f && (f = []), f[b] = e, this.storageSet(a, f, !1)
            } else void 0 == b.promise ? (d = this.getPromise(b), e = b) : (d = b.promise, e = b.obj), this.listeSynchro[a] = d, this.storageSet(a, e, !1)
        }, clearAll: function () {
            this.storageClearAll(), this.listeSynchro = []
        }, getStockageQty: function () {
            var a = {stockage: "NC", memoire: "NC"};
            return console.log(this.isStorageEnable()), this.isStorageEnable() && (console.log(this.storageQty()), a.stockage = this.storageQty()), this.isActive() && (a.memoire = this.memoryQty()), a
        }, memoryQty: function () {
            return c.log(window.performance.memory), 0
        }, reSync: function () {
            var a = this, b = {};
            angular.forEach(a.config.synchro.noSyncList, function (c) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", a.config.synchro.noSyncList, c), b[c] = a.storageGet(c)
            }), console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", b), this.clearAll(), angular.forEach(a.config.synchro.noSyncList, function (c) {
                a.storageSet(c, b[c], !1)
            }), this.init(), this.setConf("lastSynchro", this.dateSynchro())
        }, getInfoSynchro: function () {
            var a = this.getConf("lastSynchro");
            return a
        }
    };
    return d
}]), angular.module("baLogs", ["ngRoute", "ui-notification"]).config(["$routeProvider", "NotificationProvider", function (a, b) {
    console.log("Add logs route + notif"), b.setOptions({
        delay: 1e4,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: "right",
        positionY: "top"
    }), a.when("/logs", {templateUrl: "views/baLogs.html", controller: "LogsCtrl"})
}]).controller("LogsCtrl", ["$scope", "baLogs", function (a, b) {
    a.logs = b
}]).factory("baLogs", ["Notification", function (a) {
    var b = {
        active: !0, logList: [], config: null, setConfig: function (a) {
            this.config = a
        }, activate: function () {
            this.log("Logs activés"), this.active = !0
        }, unactivate: function () {
            this.active = !1, this.log("Logs désactivé")
        }, log: function () {
            var a = "Info";
            "string" == typeof arguments[1] && -1 != ["INFO", "WARN", "ERROR", "DEBUG"].indexOf(arguments[1]) && (a = arguments[1]);
            var b = "[" + a + "] : ";
            if (console.log(b, arguments), this.active)for (var c = Date.now() / 1e3 | 0, d = 0; d < arguments.length; d++)"string" == typeof arguments[d] && this.logList.unshift({
                date: c,
                type: a,
                message: arguments[d]
            })
        }, debug: function (a) {
            null != this.config && "undefined" != typeof this.config.logs.debug && this.config.logs.debug && this.log(a, "DEBUG")
        }, error: function (a) {
            this.log(a, "ERROR")
        }, info: function (a) {
            this.log(a, "INFO")
        }, warning: function (a) {
            this.log(a, "WARN")
        }, notif_error: function (b) {
            "string" == typeof b && (b = {message: b}), a.error(b)
        }, notif_success: function (b) {
            "string" == typeof b && (b = {message: b}), a.success(b)
        }, notif_warning: function (b) {
            "string" == typeof b && (b = {message: b}), a.warning(b)
        }
    };
    return b
}]), angular.module("phonegapModule", []).factory("baPhoneGap", ["baLogs", "synchro", function (a, b) {
    var c = {
        connected: !1,
        connectFailed: !1,
        mediaRec: {obj: null, file: null, infos: null},
        config: null,
        _connection: {state: 0, minDebit: !1, label: "No network connection"},
        mediaSyncInProgress: !1,
        messageInProgress: "hello ....",
        fileEntry: null,
        setConfig: function (a) {
            this.config = a
        },
        isDevice: function () {
            return "object" == typeof window.cordova ? (a.log("C'EST UN DEVICE"), !0) : (a.log("CE N'EST PAS UN DEVICE"), !1)
        },
        deviceReady: function (a) {
            "object" == typeof window.cordova && document.addEventListener("deviceready", function () {
                "undefined" != typeof a && a()
            }, !1)
        },
        isIOS: function () {
            return "IOS" == device.platform
        },
        isAndroid: function () {
            return "Android" == device.platform
        },
        isConnected: function () {
            var b = this, c = b.checkConnection();
            return b.connectFailed = b.connectFailed || 1 == b.connected && 0 == c.state, b.connected = 1 == c.state, a.log("Est connecté : ", b.connected), b.connected
        },
        checkConnection: function () {
            var a = this;
            return a.isDevice() ? (a.deviceReady(function () {
                var b = navigator.network.connection.type, c = {};
                c[Connection.UNKNOWN] = {state: 1, minDebit: !1, label: "Unknown connection"}, c[Connection.ETHERNET] = {
                    state: 1,
                    minDebit: !0,
                    label: "Ethernet connection"
                }, c[Connection.WIFI] = {state: 1, minDebit: !0, label: "WiFi connection"}, c[Connection.CELL_2G] = {
                    state: 1,
                    minDebit: !1,
                    label: "Cell 2G connection"
                }, c[Connection.CELL_3G] = {state: 1, minDebit: !0, label: "Cell 3G connection"}, c[Connection.CELL_4G] = {
                    state: 1,
                    minDebit: !0,
                    label: "Cell 4G connection"
                }, c[Connection.NONE] = {state: 0, minDebit: !1, label: "No network connection"}, a._connection = c[b]
            }), a._connection) : {state: 1, label: "WEB connection", minDebit: !1}
        },
        minDebitToTransfert: function () {
            var a = this, b = a.checkConnection();
            return b.minDebit
        },
        captureImageFromCamera: function (b) {
            var c = this;
            this.deviceReady(function () {
                navigator.device.capture.captureImage(function (d) {
                    c.loadMedia(d, "#capturedImage"), void 0 != b && void 0 != b.funcOk && (b.funcOk(), delete b.funcOk), a.log(d[0].localURL), c.processFile(d[0].localURL, c.config.media.MEDIA_TYPE_IMAGE, b)
                }, c.errorHandler)
            })
        },
        captureImageProGallery: function (b) {
            var c = this;
            this.deviceReady(function () {
                window.imagePicker.getPictures(function (d) {
                    a.log(d);
                    for (var e = 0; e < d.length; e++)a.log("Image URI: " + d[e]), c.processFile(d[e], c.config.media.MEDIA_TYPE_IMAGE, b);
                    void 0 != b && void 0 != b.funcOk && (b.funcOk(), delete b.funcOk)
                }, function (b) {
                    a.log("Error: " + b)
                })
            })
        },
        playAudio: function (a) {
            var b = this;
            this.deviceReady(function () {
                var c = a;
                b.litAudio(c)
            })
        },
        litAudio: function (a) {
            var b = this;
            this.deviceReady(function () {
                var c = a;
                null != b.mediaRec.obj && b.stopAudio(), b.createMedia(c), b.mediaRec.obj.play()
            })
        },
        stopAudio: function () {
            var a = this;
            this.deviceReady(function () {
                null != a.mediaRec.obj && (a.mediaRec.obj.stop(), a.mediaRec.obj.release(), a.mediaRec.obj = null, a.mediaRec.file = null)
            })
        },
        captureAudio: function (b) {
            var c = this;
            this.deviceReady(function () {
                a.log("Commencement enregistrement");
                var d = ".wav";
                c.isAndroid() ? d = ".3gp" : c.isIOS() && (d = ".wav");
                var e = "cdvfile://localhost/persistent/" + c.config.media.directory + "/" + c.config.audio.directory + "/" + c.config.audio.prefix + "-" + c.getDateName() + "." + d;
                c.createMedia(e), c.mediaRec.info = b, c.mediaRec.file = e, c.mediaRec.obj.startRecord()
            })
        },
        stopRecordAudio: function (b) {
            var c = this;
            this.deviceReady(function () {
                a.log("Audio() : StopRecordAudio "), c.mediaRec.obj.stopRecord(), c.mediaRec.obj.release(), c.mediaRec.obj = null
            })
        },
        verifRecordAudio: function () {
            var b = this;
            this.deviceReady(function () {
                a.log("Audio() : VerifRecordAudio "), null != b.mediaRec.obj ? (b.mediaRec.obj.getCurrentPosition(function (a) {
                    console.log(a)
                }, function (a) {
                    console.log("Error getting pos=" + a)
                }), b.mediaRec.obj.play()) : (console.log("self.mediaRec.obj = null"), b.createMedia(b.mediaRec.file), b.mediaRec.obj.play())
            })
        },
        pauseRecordAudio: function () {
            var b = this;
            this.deviceReady(function () {
                a.log("Audio() : PauseRecordAudio "), null != b.mediaRec.obj && b.mediaRec.obj.pause()
            })
        },
        validRecordAudio: function (b) {
            var c = this;
            this.deviceReady(function () {
                a.log("Audio() : validRecordAudio "), null != c.mediaRec.obj && (c.mediaRec.obj.stop(), c.mediaRec.obj.release(), c.mediaRec.obj = null), c.processFile(c.mediaRec.file, c.config.media.MEDIA_TYPE_AUDIO, b)
            })
        },
        createMedia: function (b) {
            var c = this;
            this.deviceReady(function () {
                c.mediaRec.obj = new Media(b, function () {
                    a.log("createMedia() : Audio Success"), console.log("Success create media", arguments)
                }, function (b) {
                    a.log("createMedia(): Audio Error : " + b.code), console.log("error create media", arguments)
                }, function (b) {
                    a.log("createMedia(): Audio Status : ", b), console.log("Status create media", arguments)
                })
            })
        },
        getDateName: function () {
            var a = new Date, b = a.getTime();
            return b
        },
        processFile: function (b, c, d) {
            var e = this;
            this.deviceReady(function () {
                console.log("MediaFileURL = ", b), window.resolveLocalFileSystemURL(b, function (b) {
                    e.moveFileToLocalDir(b, c, function (f) {
                        a.log("fin deplacement", b.name, " --> ", f.name), f.type = c, e.transfert(f, d)
                    })
                }, e.resOnError)
            })
        },
        storageSetAddToList: function (a, c) {
            console.log(a, c);
            var d = b.storageGet(a);
            null == d && (d = []), d.push(c), b.storageSet(a, d, !1)
        },
        storageSetDelToList: function (a, c) {
            var d = b.storageGet(a);
            null == d && (d = []);
            var e = [];
            angular.forEach(d, function (a) {
                console.log("verif pour supp localto sync : ", a.name != c, a.name, c), a.name != c && e.push(a)
            }), b.storageSet(a, e, !1)
        },
        storageGetListToSynchronize: function (a) {
            return b.storageGet(a)
        },
        synchronizeMedia: function (b, c) {
            var d = this;
            this.deviceReady(function () {
                if (d.mediaSyncInProgress)return void a.log("Synchro media déjà en cours");
                if (d.mediaSyncInProgress = !0, a.log("Synchro média : en cours  : "), "string" != typeof b && (b = d.config.media.synchroName), 1 == c || d.minDebitToTransfert() || 1 != d.config.media.useSynchro) {
                    var e = d.storageGetListToSynchronize(b);
                    null == e || 0 == e.length ? a.log("---------------> rien à faire") : (a.log("---------------> début transfert"), angular.forEach(e, function (a) {
                        console.log("Valeur dans synchro", a), d.transfert(a, a.infos, !0)
                    }))
                } else a.log("Connexion insuffisante"), a.notif_warning("Synchronisation des fichiers en attente : connexion insuffisante");
                d.mediaSyncInProgress = !1
            })
        },
        moveFileToLocalDir: function (b, c, d) {
            var e = this, f = new Date, g = (f.getTime(), ""), h = e.config.media.directory + "/";
            this.deviceReady(function () {
                switch (c) {
                    case e.config.media.MEDIA_TYPE_IMAGE:
                        g = e.config.photo.prefix + "-" + e.getDateName() + ".jpg", h += e.config.photo.directory;
                        break;
                    case e.config.media.MEDIA_TYPE_AUDIO:
                        var f = ".wav";
                        e.isAndroid() ? f = ".3gp" : e.isIOS() && (f = ".wav"), g = e.config.audio.prefix + "-" + e.getDateName() + f, h += e.config.audio.directory
                }
                console.log("type = ", c), console.log("newFileName = ", g), console.log("myFolderApp = ", h), "" != g ? window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (a) {
                    a.root.getDirectory(h, {create: !0, exclusive: !1}, function (a) {
                        console.log(a), b.moveTo(a, g, function (a) {
                            console.log("+++++", a), d(a)
                        }, function () {
                            console.log("ERR+++++", arguments)
                        })
                    }, e.errorHandler)
                }, e.errorHandler) : a.log("Error name File : empty for temporary file : " + b.fullPath)
            })
        },
        createFile: function (b, c, d) {
            var e = this;
            this.deviceReady(function () {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (f) {
                    a.log("create dir if not exist" + b), f.root.getDirectory(b, {create: !0, exclusive: !1}, function (e) {
                        a.log("create file if not exist" + c), e.filesystem.root.getFile(b + "/" + c, {create: !0}, function () {
                            null != d && d(), console.log("+333333++++", arguments)
                        }, function () {
                            console.log("ERR+++333333++", arguments)
                        })
                    }, e.errorHandler)
                }, e.errorHandler)
            })
        },
        listRepertory: function (a) {
            var b = this;
            this.deviceReady(function () {
                var c = this.config.media.directory;
                void 0 != a && (c = a), window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (a) {
                    a.root.getDirectory(c, {create: !1, exclusive: !1}, function (a) {
                        console.log(a);
                        var b = a.createReader();
                        b.readEntries(function (a) {
                            var b;
                            for (b = 0; b < a.length; b++)console.log(a[b].name)
                        }, function () {
                            console.log("ERR+++++", arguments)
                        })
                    }, b.errorHandler)
                }, b.errorHandler)
            })
        },
        loadMedia: function (a, b) {
            var c, d, e;
            for (c = 0, e = a.length; e > c; c += 1)d = a[c].fullPath, $(b).attr("src", d)
        },
        errorHandler: function (b) {
            a.log("erroHanler : Error : ", b)
        },
        transfert: function (b, c, d) {
            var e = this;
            this.deviceReady(function () {
                if (("undefined" == typeof d || d !== !0) && 1 == e.config.media.useSynchro) {
                    if (console.log("on stoke en local"), "undefined" != typeof d && 1 == d)return;
                    var f = {type: b.type, nativeURL: b.nativeURL, name: b.name, infos: c};
                    return void e.storageSetAddToList(e.config.media.synchroName, f)
                }
                if (console.log("veirf si cnsx ok"), e.minDebitToTransfert() || 1 != e.config.media.useSynchro) {
                    console.log("debut trasfert"), console.log(b);
                    var g = new FileTransfer;
                    "undefined" != typeof c && null !== c ? c.fileName = b.name : c = {fileName: b.name}, e.messageInProgress = "Tranfert du fichier : " + c.fileName;
                    var h = e.config.media.url_upload(c);
                    console.log(h), g.upload(b.nativeURL, h, function (b) {
                        a.log("Upload success : " + c.fileName + "  -- " + b.responseCode), a.log(b.bytesSent + " bytes sent"), e.messageInProgress = "Tranfert du fichier : " + c.fileName + " : OK : " + b.bytesSent + " octets envoyés", console.log("Supp ?????????????", d, e.config.media.useSynchro), "undefined" != typeof d && 1 == d && (console.log("Supp !!!!!!!!!!!!!!!"), e.storageSetDelToList(e.config.media.synchroName, c.fileName))
                    }, function (d) {
                        a.log(d), a.log("Error uploading file " + b.nativeURL + ": " + d.code), e.messageInProgress = "Tranfert du fichier : " + c.fileName + " : ERREUR", a.notif_error({
                            tile: "Transfert de media",
                            message: "Erreur du transfert, tentative ultérieure."
                        })
                    }, c)
                }
            })
        },
        onSuccessFileSystem: function (b) {
            a.log("***test: fileSystem.root.name: ", b);
            var c = this, d = "myRecording100.wav", e = b.root.getFile(d, {create: !0, exclusive: !1}, function (b) {
                a.log(b), c.mediaRec.obj = new Media(b.fullPath, function () {
                    a.log("***test: new Media() succeeded ***")
                }, function (b) {
                    a.log("***test: new Media() failed ***", b)
                }), a.log(mediaRec), mediaRec.obj.startRecord(), setTimeout(function () {
                    mediaRec.obj.stopRecord()
                }, 1e4)
            }, function (b) {
                a.log("erreur : ", b)
            });
            a.log("result ", e)
        },
        checkMediaRecFileExist: function () {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onSuccessFileSystem, null)
        },
        onOK_GetFile: function (b) {
            a.log(b);
            var c = "myRecording100.wav";
            a.log("***test: File " + c + " at " + b.fullPath);
            var d = b.fullPath;
            self.mediaRec.obj = new Media(d, function () {
                a.log("***test: new Media() succeeded ***")
            }, function (b) {
                a.log("***test: new Media() failed ***", b)
            }), a.log(mediaRec)
        },
        getContact: function () {
            var b = new ContactFindOptions;
            b.filter = "david", b.multiple = !0;
            var c = ["displayName", "name"];
            navigator.contacts.find(c, function (b) {
                a.log("val", b)
            }, function (b) {
                a.log("err", b)
            }, b)
        },
        testDev: function () {
            var a = "cdvfile://localhost/persistent/Pictures/1434619211258.jpg";
            window.resolveLocalFileSystemURL(a, function () {
                console.log("+++++", arguments)
            }, function () {
                console.log("ERR+++++", arguments)
            })
        }
    };
    return c
}]), angular.module("baTraduction", ["baLogs"]).filter("baTranslate", ["baTraduction", function (a) {
    return function (b) {
        return null != a.listTraduction && void 0 != a.listTraduction.trad && void 0 != a.listTraduction.trad[b] && "" != a.listTraduction.trad[b] ? a.listTraduction.trad[b] : b
    }
}]).factory("baTraduction", ["baLogs", "$q", "$http", function (a, b, c) {
    var d = {
        listTraduction: null, config: null, setConfig: function (a) {
            this.config = a
        }, getTraduction: function () {
            var d = b.defer(), e = this.config.traduction.protocoleWeb + this.config.traduction.UrlTrad.replace("#CODELANG#", this.config.traduction.lang);
            return c.get(e).then(function (a, b) {
                d.resolve(a.data)
            }, function (b, c) {
                a.log(b), a.log(c)
            }), d.promise
        }, majTrad: function (a) {
            if (void 0 != a) {
                var b = a();
                null != b && (d.listTraduction = b)
            }
            var c = d.getTraduction();
            c.then(function (b) {
                null == d.listTraduction ? d.listTraduction = b : void 0 != d.listTraduction.version && void 0 != b.version && d.listTraduction.version < b.version && (console.log("Nouvelle version du fichier : " + b.version), d.listTraduction = b), a(d.listTraduction)
            })
        }
    };
    return d
}]), angular.module("baFct", []).factory("baFct", function () {
    String.prototype.replaceAt = function (a, b) {
        return this.substr(0, a) + b + this.substr(a + b.length)
    };
    var a = {
        checkGoReabo: function (a) {
            var b = new Date, c = new Date(a.replaceAt(10, "T")), d = (c - b) / 1e3 / 60 / 60 / 24;
            return 15 > d ? !0 : !1
        }
    };
    return a
}), angular.module("appliMobileBatiChiffrageApp", ["ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "ngTouch", "angular-carousel", "ui.bootstrap", "angular.filter", "validation.match", "synchro", "baLogs", "phonegapModule", "uiSwitch", "baTraduction", "angulartics", "angulartics.google.analytics.cordova", "baFct"]).value("configSite", {
    profile: {
        authentificated: !1,
        UId: ""
    },
    analytics: {tag: "UA-48636001-2"},
    protocoleWeb: "http://",
    msgError: !1,
    synchro: {enabled: !0, links: [], storageEnable: !0, storageType: "W", noSyncList: ["login", "userConfig"]},
    UrlBC: "chiffrage.batiactu.com",
    traduction: {lang: "FR", UrlTrad: "192.168.3.103/appli_mobile_chiffrage/traduction_#CODELANG#.json", protocoleWeb: "http://"},
    media: {directory: "BC_MEDIA", useSynchro: !0, MEDIA_TYPE_IMAGE: 1, MEDIA_TYPE_AUDIO: 2, MEDIA_TYPE_TEXTE: 3, synchroName: "filesToSync"},
    audio: {directory: "audio", prefix: "note-vocale", maxTime: 300},
    photo: {directory: "photo", prefix: "photo", defaultFromApp: !0},
    logs: {debug: !0}
}).run(["$rootScope", "configSite", "ProjetsFactory", "ClientsFactory", "LoginFactory", "synchro", "baLogs", "baPhoneGap", "$interval", "AppFactory", "baTraduction", "MediaFactory", function (a, b, c, d, e, f, g, h, i, j, k, l) {
    var m = "";
    a.filter = {projets: {search: "", status: ""}, client: {search: ""}}, a.demande_cnx = {}, a.demande_cnx.flag = !1, a.config = b, a.SynchroStatus = {
        listeProjets: !1,
        detailProjet: [],
        detailProjetFourniture: [],
        detailClient: [],
        listeClients: !1
    }, b.urlDebug = m, b.is_device = h.isDevice(), b.media.url_upload = l.getUrlUpload, g.setConfig(b), h.setConfig(b), f.setConfig(b), k.setConfig(b), b.synchro.links.push({
        name: "listeProjets",
        callback: c.getSynchoListeProjets,
        checkIfSync: !0,
        setTimeSynchro: 1e3
    }), b.synchro.links.push({name: "listeDetailProjets", callback: c.getSynchoListeDetailProjets, specificStorage: !0}), b.synchro.links.push({
        name: "listeClients",
        callback: d.getSynchoListeClients
    }), h.createFile(b.media.directory, "create.txt"), h.createFile(b.media.directory + "/" + b.audio.directory, "create.txt"), h.createFile(b.media.directory + "/" + b.photo.directory, "create.txt"), k.majTrad(j.saveTraduction);
    var n;
    g.debug("USER CONFIG ------------------- > ", f.storageGet("userConfig")), null != (n = f.storageGet("userConfig")) && j.setUserConfig(n);
    var o = f.get("login");
    null != o && o.then(function (a) {
        1 == a.hasAbo && (e.setProfile(a), g.debug("LOGIN présent on resynchronise ?"), h.isDevice() ? h.isConnected() ? (g.debug("Appli mobile et connecté on synchronise"), f.reSync()) : (g.debug("NON CONNECTE on ne synchronisera qu'à prochaine connexion "), i(function () {
            if (h.isConnected())(0 == h.connected || 1 == h.connectFailed) && (g.debug("RESYNCHRO MINUTE"), f.reSync(), h.connectFailed = !1); else {
                var a = h.isConnected();
                g.debug(a ? "Connecté" : "non Connecté")
            }
        }, 6e4)) : (g.log("Appli Web on synchronise"), f.reSync(), i(function () {
            g.debug("Info minute -- check if connected (fake : Web)")
        }, 6e4)))
    }), i(function () {
    }, 6e4), i(function () {
        if (e.hasAbo()) {
            h.messageInProgress = "Vérification synchro media à tranférer : ";
            var a = 1;
            h.synchronizeMedia("filesToSync", a)
        }
    }, 3e5)
}]).factory("$exceptionHandler", ["$injector", function (a) {
    return function (a, b) {
        a.message += ' (caused by "' + b + '")', console.log("---------------------------------------->Erreur ", a.message)
    }
}]).config(["$compileProvider", "$locationProvider", "$routeProvider", "$sceDelegateProvider", "googleAnalyticsCordovaProvider", function (a, b, c, d, e) {
    var f = "http://192.168.3.103/appli_mobile_chiffrage/dist/";
    a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|geo|file):/), d.resourceUrlWhitelist(["self", "http://192.168.3.103/appli_mobile_chiffrage/app/**", "http://192.168.3.103/appli_mobile_chiffrage/dist/**", "https://192.168.3.103/appli_mobile_chiffrage/app/**", "https://192.168.3.103/appli_mobile_chiffrage/dist/**"]), e.trackingId = "UA-48636001-2", e.period = 20, e.debug = !0, c.when("/", {
        templateUrl: f + "views/slider.html",
        controller: "SliderCtrl"
    }).when("/login", {templateUrl: f + "views/login.html", controller: "LoginCtrl"}).when("/inscription", {
        templateUrl: f + "views/inscription.html",
        controller: "InscriptionCtrl"
    }).when("/main", {templateUrl: f + "views/main.html", controller: "MainCtrl"}).when("/profil", {
        templateUrl: f + "views/profil.html",
        controller: "ProfilCtrl"
    }).when("/projet/:PrId", {templateUrl: f + "views/projet.html", controller: "ProjetCtrl"}).when("/projets", {
        templateUrl: f + "views/projets.html",
        controller: "ProjetsCtrl"
    }).when("/fournitures/:PrId", {templateUrl: f + "views/fournitures.html", controller: "FournituresCtrl"}).when("/paramprojet/:PrId", {
        templateUrl: f + "views/paramprojet.html",
        controller: "ParamprojetCtrl"
    }).when("/moprojet/:PrId", {templateUrl: "views/moprojet.html", controller: "ParamprojetCtrl"}).when("/clients", {
        templateUrl: f + "views/clients.html",
        controller: "ClientsCtrl"
    }).when("/client/:GCId", {templateUrl: f + "views/client.html", controller: "ClientCtrl"}).when("/client/:GCId/:fromModif", {
        templateUrl: f + "views/client.html",
        controller: "ClientCtrl"
    }).when("/chiffrage", {templateUrl: f + "views/chiffrage.html", controller: "ChiffrageCtrl"}).when("/contact", {
        templateUrl: f + "views/contact.html",
        controller: "ContactCtrl"
    }).when("/logout", {templateUrl: f + "views/logout.html", controller: "LogOutCtrl"}).when("/device", {
        templateUrl: f + "views/device.html",
        controller: "DeviceCtrl"
    }).when("/code", {templateUrl: f + "views/code.html", controller: "CodeCtrl"}).when("/editions/:PrId", {
        templateUrl: f + "views/editions.html",
        controller: "EditionsCtrl"
    }).when("/gestionClient", {
        templateUrl: f + "views/gestionClient.html",
        controller: "GestionClientCtrl"
    }).when("/gestionClient/:GCId", {templateUrl: f + "views/gestionClient.html", controller: "GestionClientCtrl"}).when("/photos", {
        templateUrl: f + "views/photos.html",
        controller: "PhotosCtrl"
    }).when("/photos/:PrId", {templateUrl: f + "views/photos.html", controller: "PhotosCtrl"}).when("/sons", {
        templateUrl: f + "views/sons.html",
        controller: "SonsCtrl"
    }).when("/sons/:PrId", {templateUrl: f + "views/sons.html", controller: "SonsCtrl"}).when("/notes", {
        templateUrl: f + "views/notes.html",
        controller: "NotesCtrl"
    }).when("/notes/:PrId", {templateUrl: f + "views/notes.html", controller: "NotesCtrl"}).when("/abonnement", {
        templateUrl: f + "views/abo.html",
        controller: "AboCtrl"
    }).otherwise({redirectTo: "/"})
}]), angular.module("appliMobileBatiChiffrageApp").factory("ProjetsFactory", ["synchro", "configSite", "$http", "$q", "$rootScope", "ClientsFactory", "baPhoneGap", "baLogs", function (a, b, c, d, e, f, g, h) {
    var i = {
        projectList: !1, nbDetailToSynchronize: 5, getSynchoListeProjets: function (a) {
            var e = d.defer(), f = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_PROJETS_FAVORIS_CLIENT&UId=" + b.profile.UId + "&order=ORDER+BY+p.dt_maj+DESC%2Cp.dt_cre+DESC%2Cp.id+DESC&filtre_mask_etat=";
            return c.post(f).success(function (a, b) {
                i.projectList = a, e.resolve(i.projectList)
            }).error(function (a, b) {
                h.log(a), h.log(b)
            }), e.promise
        }, getSynchoListeDetailProjets: function (b) {
            var c = a.get("listeProjets");
            return null == c ? null : void c.then(function (a) {
                e.SynchroStatus.listeProjets = !0;
                var b = i.nbDetailToSynchronize;
                a.length < i.nbDetailToSynchronize && (b = a.length);
                for (var c = 0; b > c; c++)i.getSynchoDetailProjets(a[c].PrId)
            })
        }, getSynchroFourniture: function (f) {
            var g = d.defer(), h = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_LISTE_COMPOS&PrId=" + f;
            c.post(h).success(function (a) {
                g.resolve(a)
            }), a.set("F-" + f, {promise: g.promise, obj: {}}), g.promise.then(function (b) {
                e.SynchroStatus.detailProjetFourniture["F-" + f] = !0, a.set("F-" + f, {promise: g.promise, obj: b})
            })
        }, getSynchroDoc: function (f) {
            var g = d.defer(), h = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_DOCUMENT_DEVIS&type=FACT&UId=" + b.profile.UId + "&PrId=" + f;
            c.post(h).success(function (a) {
                g.resolve(a)
            }), a.set("D-" + f, {promise: g.promise, obj: {}}), g.promise.then(function (b) {
                e.SynchroStatus.detailProjetFourniture["D-" + f] = !0, a.set("D-" + f, {promise: g.promise, obj: b})
            })
        }, getSynchoDetailProjets: function (g) {
            var h = d.defer(), j = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_PROJET&fonction=loadProjet&async=false&PrId=" + g;
            c.post(j).success(function (a, b) {
                h.resolve(a)
            }), a.set(g, {promise: h.promise, obj: {}}), h.promise.then(function (b) {
                e.SynchroStatus.detailProjet[b.PrId] = !0, a.set(b.PrId, {
                    promise: h.promise,
                    obj: b
                }), "" != b.GCId && f.getSynchroClient(b.GCId), i.getSynchroFourniture(b.PrId), i.getSynchroDoc(b.PrId)
            })
        }, isProjectSynchronized: function (b) {
            if (!a.isActive())return "";
            var c = e.SynchroStatus.detailProjet[b];
            return void 0 != c && 1 == c ? "S" : ""
        }, getListeProjets: function () {
            var b = a.get("listeProjets");
            return null != b ? b : null
        }, getProjet: function (b, c) {
            var d = a.get(b);
            if (null == d || void 0 != c && 1 == c) {
                var f = g.checkConnection();
                if (0 == f.state)return h.log("Pas de connexion : getProjet"), e.demande_cnx.flag = !0, null;
                this.getSynchoDetailProjets(b), d = a.get(b)
            }
            return d
        }, getFourniture: function (b, c) {
            var d = "F-" + b, f = a.get(d);
            if (null == f || void 0 != c && 1 == c) {
                var i = g.checkConnection();
                if (0 == i.state)return h.log("Pas de connexion : getFourniture"), e.demande_cnx = !0, null;
                this.getSynchroFourniture(b), f = a.get(d)
            }
            return f
        }, getDoc: function (b) {
            var c = "D-" + b, d = a.get(c);
            if (null == d) {
                var f = g.checkConnection();
                if (0 == f.state)return h.log("Pas de connexion : getDoc"), e.demande_cnx = !0, null;
                this.getSynchroDoc(b), d = a.get(c)
            }
            return d
        }, resyncProjetsListe: function () {
            a.resynchronize("listeProjets")
        }
    };
    return i
}]), angular.module("appliMobileBatiChiffrageApp").factory("MediaFactory", ["configSite", "$http", "$q", "$rootScope", "baLogs", "baPhoneGap", function (a, b, c, d, e, f) {
    var g = {
        loader: {loading: !1}, getListeMedia: function (d, f) {
            var h = c.defer();
            e.debug("J'APPELLE LE WS photo"), g.loader = {loading: !0};
            var i = a.protocoleWeb + a.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=LIST_MEDIA&UId=" + a.profile.UId + "&order=ORDER+BY+dt_maj+DESC%2Cdt_cre+DESC%2Cid+DESC&filtre_mask_etat=&PrId=" + d + "&type=".type;
            return b.post(i).success(function (a, b) {
                var c = a;
                h.resolve(c)
            })["finally"](function () {
                g.loader = {loading: !1}
            }), h.promise
        }, getListePhoto: function (a) {
            return g.getListeMedia(a, "IMAGE")
        }, getListeAudio: function (a) {
            return g.getListeMedia(a, "AUDIO")
        }, getUrlUpload: function (b) {
            return console.log(b), a.protocoleWeb + a.UrlBC + "/scripts/interfaceEL.php?form=file&origin=MOBILE&mode=NEW_MEDIA&UId=" + a.profile.UId + "&PrId="
        }, getListeEntransfert: function (a) {
            var b = f.storageGetListToSynchronize("filesToSync"), c = [];
            return null != b && angular.forEach(b, function (b) {
                console.log("Valeur dans synchro", b), b.type == a && c.push(b)
            }), c
        }, getAudioEntransfert: function () {
            return g.getListeEntransfert(a.media.MEDIA_TYPE_AUDIO)
        }, getPhotoEntransfert: function () {
            return g.getListeEntransfert(a.media.MEDIA_TYPE_IMAGE)
        }
    };
    return g
}]), angular.module("appliMobileBatiChiffrageApp").factory("ClientsFactory", ["synchro", "configSite", "$http", "$q", "$rootScope", "baPhoneGap", "baLogs", function (a, b, c, d, e, f, g) {
    var h = {
        customerList: !1, getSynchoListeClients: function (a) {
            var e = d.defer();
            g.log("J'APPELLE LE WS");
            var f = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_LISTE_GCLIENTS&UId=" + b.profile.UId + "&type=CLIENT&order=ORDER+BY+nom+ASC%2C+dt_cre+DESC%2C+id+DESC&IDX";
            return c.post(f).success(function (a, b) {
                h.customerList = a, e.resolve(h.customerList)
            }), e.promise
        }, getSynchroClient: function (f) {
            var g = d.defer(), h = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?origin=MOBILE&mode=GET_GCLIENT&fonction=loadGClient&async=false&GCId=" + f;
            c.post(h).success(function (a) {
                g.resolve(a)
            }), a.set(f, {promise: g.promise, obj: {}}), g.promise.then(function (b) {
                e.SynchroStatus.detailClient[f] = !0, a.set(f, {promise: g.promise, obj: b})
            })
        }, getListeClients: function () {
            var b = a.get("listeClients");
            return null != b ? b : null
        }, getClient: function (b, c) {
            var d = a.get(b);
            if (null == d || void 0 != c && 1 == c) {
                var h = f.checkConnection();
                if (0 == h.state)return g.log("Pas de connexion : getClient"), e.demande_cnx.flag = !0, null;
                this.getSynchroClient(b), d = a.get(b)
            }
            return d
        }, resyncClientListe: function () {
            a.resynchronize("listeClients")
        }
    };
    return h
}]), angular.module("appliMobileBatiChiffrageApp").factory("LoginFactory", ["synchro", "configSite", "$http", "$q", "$rootScope", "baLogs", function (a, b, c, d, e, f) {
    var g = {
        getSynchoLogin: function () {
            return null
        }, getNbAbo: function (c) {
            return f.log("########### Liste des Abo", c[0]), f.log("########## count abo", c.length), 0 == c.length ? (b.profile.hasAbo = !1, a.set("login", b.profile), !1) : (b.profile.hasAbo = !0, a.set("login", b.profile), !0)
        }, mustLog: function () {
            var a = 0 == b.profile.authentificated || 0 == b.profile.hasAbo;
            return a && f.log("go Login"), a
        }, hasAbo: function () {
            return b.profile.hasAbo
        }, setProfile: function (c) {
            angular.forEach(c, function (a, c) {
                b.profile[c] = a
            }), console.log(b.profile, "plopplop"), a.set("login", b.profile)
        }
    };
    return g
}]), angular.module("appliMobileBatiChiffrageApp").factory("SettingsFactory", ["synchro", "baLogs", function (a, b) {
    var c = {
        getStockageQty: function () {
            return a.getStockageQty()
        }
    };
    return c
}]), angular.module("appliMobileBatiChiffrageApp").factory("AppFactory", ["$modal", "baLogs", "configSite", "synchro", function (a, b, c, d) {
    var e = {
        alertCnxDemanded: function (a, c, d) {
            b.log("CHECK : CHANFGE demande de CNX !!!!!!"), 1 == d.demande_cnx.flag && (e.afficheDemandeCnx(!0), d.demande_cnx.flag = !1)
        }, afficheDemandeCnx: function (b) {
            a.open({
                animation: !0, templateUrl: "template/modal/cnxDemand.html", backdrop: !0, windowClass: "modal", controller: ["$scope", "$modalInstance", function (a, c) {
                    a.cancel = function () {
                        c.dismiss("cancel"), void 0 != b && 1 == b && window.history.back()
                    }
                }]
            })
        }, setUserConfig: function (a) {
            c.audio = a.audio, c.photo = a.photo
        }, saveUserConfig: function () {
            var a = {audio: c.audio, photo: c.photo};
            d.storageSet("userConfig", a, !1)
        }, saveTraduction: function (a) {
            return "undefined" != typeof a ? (d.storageSet("trads", a, !1), null) : d.storageGet("trads")
        }
    };
    return e
}]), angular.module("appliMobileBatiChiffrageApp").filter("formatPrix", function () {
    return function (a) {
        return (Math.round(100 * a) / 100).toFixed(2).replace(".", ",")
    }
}).filter("NettoyagePhoneNumber", function () {
    return function (a) {
        if ("undefined" != typeof a) {
            var b = new RegExp("[-._/*() ]", "g");
            return a = a.replace(b, "")
        }
    }
}).filter("formatPhoneNumber", function () {
    return function (a) {
        if ("undefined" != typeof a) {
            if ("+" == a.substr(0, 1))return a;
            if ("00" == a.substr(0, 2))return a.replace(a.substr(0, 2), "+");
            if ("0" == a.substr(0, 1))return a.replace(a.substr(0, 1), "+33")
        }
    }
}).filter("AffPhoneNumber", function () {
    return function (a) {
        if ("undefined" != typeof a) {
            if ("+33" == a.substr(0, 3)) {
                a = a.replace(a.substr(0, 3), "0");
                var b = a.match(/.{2}/g);
                a = b.join(" ")
            } else {
                var b = a.match(/.{2}/g);
                a = b.join(" ")
            }
            return a
        }
    }
}).filter("tauxtva", function () {
    return function (a) {
        var b = 100 * (a - 1);
        return (Math.round(100 * b) / 100).toFixed(2).replace(".", ",")
    }
}).filter("formatNumber2chiffres", function () {
    return function (a) {
        return (Math.round(100 * a) / 100).toFixed(2).replace(".", ",")
    }
}).filter("replacePointParVirgule", function () {
    return function (a) {
        return String(a).replace(".", ",")
    }
}).filter("formatDatemdY", function () {
    return function (a) {
        var b = String(a).split(" "), c = b[0].split("-");
        return c[2] + "/" + c[1] + "/" + c[0]
    }
}).filter("html", ["$sce", function (a) {
    return function (b) {
        return a.trustAsHtml(b)
    }
}]).filter("trustUrl", ["$sce", function (a) {
    return function (b) {
        return a.trustAsResourceUrl(b)
    }
}]).filter("cleanUrl", function () {
    return function (a) {
        return String(a).replace("../", "")
    }
}).filter("formatTimestamp", function () {
    return function (a) {
        var b = new Date(1e3 * a);
        return b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate() + " " + b.getHours() + ":" + b.getMinutes() + ":" + b.getSeconds()
    }
}).filter("formatMillierNumber", function () {
    return function (a) {
        return a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
    }
}), angular.module("appliMobileBatiChiffrageApp").directive("loader", function () {
    return {template: '<div ng-show="loader.loading"><img src="images/loading.gif" style="width: 100px; height: 100px;" class="center-block mg-t-15"></div>'}
}), angular.module("appliMobileBatiChiffrageApp").directive("back", ["$window", function (a) {
    return {
        restrict: "A", link: function (b, c, d) {
            c.bind("click", function () {
                a.history.back()
            })
        }
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("MainCtrl", ["$scope", "$rootScope", "$http", "$location", "ProjetsFactory", "ClientsFactory", "configSite", "LoginFactory", "baLogs", "baFct", function (a, b, c, d, e, f, g, h, i, j) {
    if (a.projets = !1, a.clients = !1, a.GCId = !1, h.mustLog())g.msgError = !1, d.path(""); else {
        a.checkGoReabo = j.checkGoReabo;
        var k = e.getListeProjets();
        i.log("MAIN : ", k), null != k && k.then(function (b) {
            a.projets = b;
            var c = b.length;
            c > 5 ? a.countProj = 5 : a.countProj = c
        });
        var l = f.getListeClients();
        null != l && l.then(function (b) {
            a.clients = b.liste;
            var c = b.liste.length;
            c > 5 ? a.countClient = 5 : a.countClient = c
        });
        var m = window.location.hash.split("/")[1], n = m.substring(m.length - 1, m.length);
        "s" != n && (m += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + m).addClass("active")
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("FooterCtrl", ["$scope", "configSite", "baLogs", "baPhoneGap", function (a, b, c, d) {
    a.baPhoneGap = d, a.messageFooter = "", a.$watch("baPhoneGap.messageInProgress", function () {
        a.messageFooter = d.messageInProgress, jQuery(".message-info").stop().fadeIn(), jQuery(".message-info").fadeOut(5e3)
    })
}]), angular.module("appliMobileBatiChiffrageApp").controller("AboCtrl", ["$scope", "configSite", "baLogs", "baFct", "$location", "$http", "$window", function (a, b, c, d, e, f, g) {
    a.checkGoReabo = d.checkGoReabo, a.msgresult = {"class": "", message: ""}, a.openChiffrage = function () {
        g.open(b.protocoleWeb + b.UrlBC + "/abonnement-logiciel-batichiffrage.php", "_blank", "location=yes")
    }, a.envoi = function () {
        var c = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?mode=DEMANDE_CONTACT_MOBILE&UID=" + b.profile.UId;
        f.post(c).success(function (b, c) {
            "KO" != b ? a.msgresult = {"class": "alert-success", message: "Votre demande a été envoyé avec succès"} : a.msgresult = {
                "class": "alert-danger",
                message: "Votre demande n'a pas pu être envoyé"
            }
        })
    };
    var h = window.location.hash.split("/")[1], i = h.substring(h.length - 1, h.length);
    "s" != i && (h += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + h).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("ProfilCtrl", ["$scope", "LoginFactory", "configSite", "$location", "$http", function (a, b, c, d, e) {
    if (b.mustLog())c.msgError = !1, d.path(""); else {
        a.formProfil = {
            societe: c.profile.societe,
            prenom: c.profile.prenom,
            nom: c.profile.nom,
            cnaf2: c.profile.cnaf2,
            login: c.profile.login,
            loginConfirm: c.profile.login,
            password: c.profile.password,
            passwordConfirm: c.profile.password,
            telephone: c.profile.telephone,
            fax: c.profile.fax,
            email_contact: c.profile.email_contact,
            adresse: c.profile.adresse,
            cp: c.profile.cp,
            ville: c.profile.ville,
            pays: c.profile.pays
        };
        var f = {mode: "GET_LISTE_PAYS"}, g = c.protocoleWeb + c.UrlBC + "/scripts/interface.php";
        e({url: g, method: "GET", params: f}).success(function (b, c) {
            a.Tpays = b
        })["finally"](function () {
            a.loader = {loading: !1}
        });
        var h = {mode: "GET_LISTE_ACTIVITE"};
        e({url: g, method: "GET", params: h}).success(function (b, c) {
            a.TActivite = b
        })["finally"](function () {
            a.loader = {loading: !1}
        })
    }
    var i = window.location.hash.split("/")[1], j = i.substring(i.length - 1, i.length);
    "s" != j && (i += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + i).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("ContactCtrl", ["$scope", "ProjetsFactory", "baLogs", "baPhoneGap", "AppFactory", "configSite", "$http", function (a, b, c, d, e, f, g) {
    c.log(localStorage), a.formContact = {email: "", nom: "", prenom: "", societe: "", telephone: "", message: ""}, a.msgresult = {
        "class": "",
        message: ""
    }, a.formContact.submitTheForm = function (b, c) {
        var h = d.checkConnection();
        if (10 == h.state)return void e.afficheDemandeCnx();
        var i = "" != a.config.profile.UId ? a.config.profile.UId : "", j = {
            email: a.formContact.email,
            nom: a.formContact.nom,
            prenom: a.formContact.prenom,
            societe: a.formContact.societe,
            telephone: a.formContact.telephone,
            message: a.formContact.message,
            UId: i
        }, k = f.protocoleWeb + f.UrlBC + "/scripts/interfaceEL.php?mode=SEND_MAIL_DEMANDE_MOBILE&UID=" + j.UId + "&email=" + j.email + "&nom=" + j.nom + "&prenom=" + j.prenom + "&societe=" + j.societe + "&telephone=" + j.telephone + "&message=" + j.message;
        g.post(k).success(function (b, c) {
            console.log(b, "########## réponse SEND_MAIL_DEMANDE_MOBILE"), "KO" != b ? a.msgresult = {
                "class": "alert-success",
                message: "Votre message a été envoyé avec succès"
            } : a.msgresult = {"class": "alert-danger", message: "Votre message n'a pas pu être envoyé"}
        })
    };
    var h = window.location.hash.split("/")[1], i = h.substring(h.length - 1, h.length);
    "s" != i && (h += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + h).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("ProjetCtrl", ["$scope", "$rootScope", "$http", "$location", "$routeParams", "$route", "ProjetsFactory", "configSite", "LoginFactory", "AppFactory", "baLogs", function (a, b, c, d, e, f, g, h, i, j, k) {
    a["synchronized"] = !1, a.btnLinkVisible = !0, a.displayProjet = !0, a.detailProjet = !1, a.displayDetail = function () {
        a.btnLinkVisible = !1, a.detailProjet = !0, a.displayProjet = !1
    }, a.retourProjet = function () {
        a.btnLinkVisible = !0, a.detailProjet = !1, a.displayProjet = !0
    };
    var l = function (b) {
        null != b && b.then(function (b) {
            if (null != b && 0 !== Object.keys(b).length) {
                a.projet = b, a.lignes = b.TLigne, a.tvas = b.TListeTVA;
                var c = 0;
                angular.forEach(b.TListeTVA, function (a, b) {
                    c += parseFloat(a.total)
                }), a.sum = Math.round(100 * c) / 100, a["synchronized"] = !0
            }
        })
    }, m = function (b) {
        null != b && b.then(function (b) {
            a.doc = b
        })
    };
    if (a.syncrho_projet = function () {
            k.log("syncrho_projet + DOC"), l(g.getProjet(e.PrId, !0)), f.reload()
        }, i.mustLog())h.msgError = !1, d.path(""); else {
        a.$watch(a.demande_cnx.flag, j.alertCnxDemanded), a.oneAtATime = !0, a.status = {isFirstOpen: !1, isFirstDisabled: !1};
        var n = g.getProjet(e.PrId);
        l(n);
        var o = g.getDoc(e.PrId);
        m(o), a.testLibelle = function (a) {
            return "<NULL>" != a
        };
        var p = window.location.hash.split("/")[1], q = p.substring(p.length - 1, p.length);
        "s" != q && (p += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + p).addClass("active")
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ProjetsCtrl", ["$scope", "ProjetsFactory", "$http", "$location", "configSite", "LoginFactory", "baLogs", "$route", function (a, b, c, d, e, f, g, h) {
    if (a.projets = {}, a.ProjetsFactory = b, f.mustLog())e.msgError = !1, d.path(""); else {
        var i = b.getListeProjets();
        if (null != i) {
            i.then(function (b) {
                a.projets = b
            })
        }
        var j = a.projets.length - 1;
        j > 5 ? a.countProj = 5 : a.countProj = j;
        var k = window.location.hash.split("/")[1], l = k.substring(k.length - 1, k.length);
        "s" != l && (k += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + k).addClass("active")
    }
    a.synchro_listProjet = function () {
        g.log("synchro_listProjet"), b.resyncProjetsListe(), h.reload()
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("FournituresCtrl", ["$scope", "$http", "$location", "$routeParams", "configSite", "ProjetsFactory", "LoginFactory", "AppFactory", "baLogs", function (a, b, c, d, e, f, g, h, i) {
    if (g.mustLog())e.msgError = !1, c.path(""); else {
        a.$watch(a.demande_cnx.flag, h.alertCnxDemanded);
        var j = f.getFourniture(d.PrId);
        null != j && j.then(function (b) {
            a.fournitures = b
        });
        var k = f.getProjet(d.PrId);
        null != k && k.then(function (b) {
            a.projet = b
        })
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ParamprojetCtrl", ["$scope", "$location", "$routeParams", "configSite", "ProjetsFactory", "LoginFactory", "baLogs", function (a, b, c, d, e, f, g) {
    if (f.mustLog())d.msgError = !1, b.path(""); else {
        var h = e.getProjet(c.PrId);
        null != h && h.then(function (b) {
            a.projet = b, a.tvas = b.TTauxTVA
        }), a.calculRemFO = function (a) {
            return a = 100 - (100 * a - 77) / .28, Math.round(100 * a) / 100
        }, a.calculDiffCh = function (a) {
            return a = 100 - (100 * a - 90) / .25, Math.round(100 * a) / 100
        }
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ClientCtrl", ["$scope", "$http", "$location", "$routeParams", "configSite", "ClientsFactory", "LoginFactory", "AppFactory", "$route", "baLogs", function (a, b, c, d, e, f, g, h, i, j) {
    a.fromModif = void 0 != d.fromModif ? !0 : !1;
    var k = function (b) {
        null != b && b.then(function (b) {
            a.client = b, a.client.adresseaff = b.adresse.split("\n").join("<br/>"), a.client.commentaireaff = b.commentaire.split("\n").join("<br/>"), a.projetsLies = b.TListe_projets_lies, a.countProjetLie = b.TListe_projets_lies.length
        })
    };
    if (a.syncrho_client = function () {
            j.log("syncrho_client"), k(f.getClient(d.GCId, !0)), i.reload()
        }, g.mustLog())e.msgError = !1, c.path("login"); else {
        a.$watch(a.demande_cnx.flag, h.alertCnxDemanded), a.GCId = d.GCId;
        var l = f.getClient(d.GCId);
        k(l);
        var m = window.location.hash.split("/")[1], n = m.substring(m.length - 1, m.length);
        "s" != n && (m += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + m).addClass("active")
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ClientsCtrl", ["$scope", "$rootScope", "$http", "$location", "configSite", "ClientsFactory", "LoginFactory", "baLogs", function (a, b, c, d, e, f, g, h) {
    if (g.mustLog())e.msgError = !1, d.path(""); else {
        var i = f.getListeClients();
        null != i && i.then(function (b) {
            a.clients = b.liste
        });
        var j = window.location.hash.split("/")[1], k = j.substring(j.length - 1, j.length);
        "s" != k && (j += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + j).addClass("active")
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ChiffrageCtrl", ["$scope", "$location", "baLogs", function (a, b, c) {
    a.params = b.search();
    var d = window.location.hash.split("/")[1], e = d.substring(d.length - 1, d.length);
    "s" != e && (d += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + d).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("LoginCtrl", ["$scope", "$location", "$http", "configSite", "synchro", "LoginFactory", "AppFactory", "baPhoneGap", "baLogs", function (a, b, c, d, e, f, g, h, i) {
    a.formLogin = {}, e.setConfig(d), "" != a.config.EmailFromInscription && (a.formLogin.email = a.config.EmailFromInscription);
    var j = null;
    i.log("############ PATH ", b.path()), null != (j = e.get("login")) && j.then(function (a) {
        if (1 == a.hasAbo) {
            if ("" == a.UId)return;
            f.setProfile(a), b.path("main")
        } else b.path("code")
    }), a.formLogin.submitTheForm = function (j, k) {
        var l = h.checkConnection();
        if (10 == l.state)return void g.afficheDemandeCnx();
        var m = {
            email: a.formLogin.email,
            password: a.formLogin.password
        }, n = d.protocoleWeb + d.UrlBC + "/scripts/interface.php?mode=LOGIN&email=" + m.email + "&pass=" + m.password + "&cle_cryptage=&siret=&source=";
        console.log(n), c.post(n).success(function (a, c) {
            '"KO"' != a ? (console.log(a, "blablabla"), f.setProfile({
                authentificated: !0,
                SId: a.user.SId,
                SId_mobile: a.user.SId_mobile,
                UId: a.UId,
                abonnement: a.user.abonnement,
                adresse: a.user.adresse,
                cp: a.user.cp,
                dt_cre: a.user.dt_cre,
                dt_maj: a.user.dt_maj,
                dt_finabo: a.user.dt_finabo,
                capital_user: a.user.capital_user,
                cnaf2: a.cnaf2,
                cnaf_user: a.user.cnaf_user,
                civ: a.user.civ,
                nom: a.user.nom,
                prenom: a.user.prenom,
                email_contact: a.user.email_contact,
                forme_juridique_user: a.user.forme_juridique_user,
                logo_client: a.user.logo_client,
                fax: a.user.fax,
                pays: a.user.pays,
                profession: a.user.profession,
                rcs_rm_user: a.user.rcs_rm_user,
                siren_user: a.user.siren_user,
                societe: a.user.societe,
                statut: a.user.statut,
                telephone: a.user.telephone,
                tva_intracomm_user: a.user.tva_intracomm_user,
                ville: a.user.ville,
                login: a.user.login,
                email: a.user.email,
                password: a.user.password
            }), 0 == f.getNbAbo(a.TAbonnement) ? (i.log("########### REDIRECTION VERS LE CODE"), b.path("code")) : (i.log("########### REDIRECTION VERS LE MAIN"), e.init(d), e.set("login", d.profile), b.path("main"))) : (d.msgError = !0, b.path("login"))
        }).error(function () {
            console.log(arguments)
        })
    }, a.logout = function () {
        d.profile.authentificated = !1, d.profile.UId = "", d.msgError = !1, e.clearAll(), b.path("")
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("LogOutCtrl", ["$scope", "$location", "configSite", "synchro", "baLogs", function (a, b, c, d, e) {
    c.profile.authentificated = !1, c.profile.UId = "", c.msgError = !1, d.clearAll(), b.path("")
}]), angular.module("appliMobileBatiChiffrageApp").controller("SettingsCtrl", ["$scope", "SettingsFactory", "baPhoneGap", "baLogs", "AppFactory", "configSite", "synchro", function (a, b, c, d, e, f, g) {
    a.stockage = b.getStockageQty(), a.connexion = c.checkConnection(), a.saveConfig = function () {
        e.saveUserConfig()
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ModalPassOublieCtrl", ["$scope", "$modal", "baLogs", function (a, b, c) {
    a.animationsEnabled = !0, a.formPassOublie = {email: ""}, a.open = function () {
        b.open({
            animation: a.animationsEnabled,
            templateUrl: "template/modal/ModalPassOublie.html",
            backdrop: !0,
            windowClass: "modal",
            controller: ["$scope", "$modalInstance", "$log", "formPassOublie", "configSite", "$http", function (a, b, c, d, e, f) {
                a.formPassOublie = d, a.msgpw = {"class": "", message: ""}, a.msgpw2 = {"class": ""}, a.submitPassOublie = function () {
                    var b = {email: a.formPassOublie.email};
                    a.msgpw = {"class": "", message: ""}, a.msgpw2 = {"class": ""};
                    var c = e.protocoleWeb + e.UrlBC + "/scripts/interface.php?mode=CHECK_EMAIL&email=" + b.email;
                    f.post(c).success(function (c, d) {
                        if ('"!EXIST"' == c)a.msgpw2 = {"class": "alert-danger"}; else {
                            var g = e.protocoleWeb + e.UrlBC + "/scripts/interface.php?mode=FORGOT_PASS&email=" + b.email;
                            f.post(g).success(function (c, d) {
                                '"OK"' == c && (a.msgpw = {"class": "alert-success", message: "Vos identifiants ont bien été envoyés à l'adresse mail\r\n" + b.email})
                            })
                        }
                    })
                }, a.cancel = function () {
                    b.dismiss("cancel")
                }, a.close_pop = function () {
                    b.dismiss("cancel")
                }
            }],
            resolve: {
                formPassOublie: function () {
                    return a.formPassOublie
                }
            }
        })
    }, a.toggleAnimation = function () {
        a.animationsEnabled = !a.animationsEnabled
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("ModalTest24Ctrl", ["$scope", "$modal", "baLogs", function (a, b, c) {
    a.animationsEnabled = !0, a.formTest = {societe: "", nom: "", prenom: "", email: "", tel: ""}, a.open = function () {
        b.open({
            animation: a.animationsEnabled,
            templateUrl: "template/modal/Modal24h.html",
            backdrop: !0,
            windowClass: "modal",
            controller: ["$scope", "$modalInstance", "$log", "formTest", "configSite", "$http", "$location", "LoginFactory", "$timeout", function (a, b, d, e, f, g, h, i, j) {
                a.formTest = e, a.msgtest = {"class": "", message: ""}, a.submitTest = function () {
                    a.msgtest = {"class": "", message: ""};
                    var d = {mode: "CHECK_EMAIL", email: a.formTest.email}, e = f.protocoleWeb + f.UrlBC + "/scripts/interface.php";
                    g({url: e, method: "GET", params: d}).success(function (d, e) {
                        if ('"EXIST"' == d)a.msgtest = {"class": "alert-danger", message: "L'adresse email saisie est déjà enregistrée !"}; else {
                            var k = {
                                mode: "SAVE_PROSPECT",
                                source: "Mobile",
                                nom: a.formTest.societe,
                                email: a.formTest.email,
                                tel1: a.formTest.tel,
                                MYTLV_nomcontact: a.formTest.nom,
                                MYTLV_prenomcontact: a.formTest.prenom
                            }, l = f.protocoleWeb + f.UrlBC + "/scripts/interface.php";
                            g({url: l, method: "GET", params: k}).success(function (d, e) {
                                c.log("########### DATA CREATION PROSPECT", d), d.id > 0 ? (i.setProfile({
                                    authentificated: !0,
                                    UId: d.UId,
                                    nom: d.user.nom,
                                    prenom: d.user.prenom,
                                    abonnement: d.user.abonnement
                                }), 0 == i.getNbAbo(d.TAbonnement) ? (c.log("########### REDIRECTION VERS LE CODE"), a.msgtest = {
                                    "class": "alert-success",
                                    message: "Votre code d'accès vient de vous être envoyé par SMS au " + d.tel1 + " et par mail à " + d.email
                                }, j(function () {
                                    b.dismiss("cancel"), h.path("code")
                                }, 4e3)) : (c.log("########### REDIRECTION VERS LE MAIN"), b.dismiss("cancel"), h.path("main"))) : a.msgtest = {
                                    "class": "alert-danger",
                                    message: "Une erreur est survenue lors de la création de votre compte"
                                }
                            })
                        }
                    })
                }, a.cancel = function () {
                    b.dismiss("cancel"), h.path("login")
                }
            }],
            resolve: {
                formTest: function () {
                    return a.formTest
                }
            }
        })
    }, a.toggleAnimation = function () {
        a.animationsEnabled = !a.animationsEnabled
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("CodeCtrl", ["$scope", "$location", "configSite", "synchro", "$http", "LoginFactory", "baLogs", function (a, b, c, d, e, f, g) {
    a.formCode = {code: ""}, a.msgcode = {"class": "", message: ""}, a.submitCode = function () {
        a.msgcode = {"class": "", message: ""}, g.log("########### SUBMIT CODE");
        var d = {code: a.formCode.code}, h = c.protocoleWeb + c.UrlBC + "/scripts/interface.php?mode=CHECK_CODE_MOBILE&code=" + d.code + "&UId=" + c.profile.UId;
        e.post(h).success(function (c, d) {
            g.log("################ USER : ", c), f.getNbAbo(c.TAbonnement) ? (f.setProfile({
                abonnement: c.user.abonnement,
                dt_finabo: c.user.dt_finabo
            }), b.path("main")) : a.msgcode = {"class": "alert-danger", message: "Code erroné"}
        })
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("EditionsCtrl", ["$scope", "ProjetsFactory", "$http", "$location", "configSite", "LoginFactory", "$routeParams", "baLogs", function (a, b, c, d, e, f, g, h) {
    a.document = {};
    var i = e.protocoleWeb + e.UrlBC + "/scripts/interfaceEL.php?mode=GET_DOCUMENT_DEVIS&UId=" + e.profile.UId + "&PrId=" + g.PrId;
    c.post(i).success(function (b, c) {
        a.document = b
    })
}]), angular.module("appliMobileBatiChiffrageApp").controller("DeviceCtrl", ["$scope", "configSite", "baLogs", "baPhoneGap", "$http", "$interval", "$modal", function (a, b, c, d, e, f, g) {
    var h = "", i = null;
    a.message = "ok", a.msgSuccess = !1, a.ght = !1, a.config.is_device = !0, a.getPhoto = function (a) {
        if (console.log(a), d.isDevice()) {
            g.open({
                templateUrl: h + "template/modal/photoSelect.html",
                windowClass: "modal",
                controller: ["$scope", "$modalInstance", "baLogs", "baPhoneGap", function (b, c, d, e) {
                    b.photoSel = {fromSource: b.config.photo.defaultFromApp ? "app" : "gal", numProjet: 0}, b.cancel = function () {
                        c.dismiss("cancel")
                    }, b.go = function () {
                        var f = {};
                        b.prjDemand = !0, void 0 != a ? (f = {numProjet: a}, b.prjDemand = !1) : f = {numProjet: b.photoSel.numProjet}, console.log(b.photoSel, f), "app" == b.photoSel.fromSource ? (f.funcOk = function () {
                            d.notif_success({message: "Message ok, photo prise", title: "Prise photo"})
                        }, console.log("appareil photo"), e.captureImageFromCamera(f)) : (f.funcOk = function () {
                            d.notif_success({message: "Photo(s) de la gallerie sélectionnée(s)", title: "Selection photo"})
                        }, console.log("depuis gallery"), e.captureImageProGallery(f)), c.dismiss("cancel")
                    }
                }]
            })
        }
    }, a.getAudio = function (a) {
        if (d.isDevice()) {
            var c = {};
            c = void 0 != a ? {numProjet: a} : {numProjet: 0};
            {
                g.open({
                    templateUrl: h + "template/modal/audio.html", windowClass: "modal", controller: ["$scope", "$modalInstance", "baLogs", "baPhoneGap", function (a, d, e, g) {
                        a.etat = "", a.cancel = function () {
                            a.etat = "", g.stopAudio(), d.dismiss("cancel")
                        }, a.stopAudio = function () {
                            a.etat = "stop", f.cancel(i), g.stopRecordAudio(c), $("#progress").html(""), i = null
                        }, a.verifAudio = function () {
                            a.etat = "verif", g.verifRecordAudio()
                        }, a.pauseAudio = function () {
                            a.etat = "stop", g.pauseRecordAudio()
                        }, a.validAudio = function () {
                            a.etat = "stop", g.validRecordAudio(c), d.dismiss("cancel")
                        }, a.enregAudio = function () {
                            if (a.etat = "enreg", null != i)console.log("aucune action"); else {
                                g.captureAudio(), a.ght = !0;
                                var c = 0;
                                i = f(function () {
                                    var d = 100 / b.audio.maxTime, e = d * c, g = b.audio.maxTime - c;
                                    $("#progress").html('<div class="progress-bar" role="progressbar" aria-valuenow="' + c + '"aria-valuemin="0" aria-valuemax="' + d + '" style="width:' + e + '%">' + g + " sec</div>"), c++, c > b.audio.maxTime && (f.cancel(i), a.stopAudio())
                                }, 1e3)
                            }
                        }
                    }]
                })
            }
        }
    }, a.litAudio = function (a) {
        d.litAudio(a)
    }, a.stopAudio = function () {
        d.stopAudio()
    }, a.setDevice = function () {
        c.log("Passage en mode device"), a.config.is_device = !0
    }, a.sendMedia = function () {
        c.log("Lancement de synchro de medias manuelle ");
        var a = 1;
        d.baPhoneGap.synchronizeMedia("filesToSync", a)
    }, a.delMedia = function (d) {
        if (void 0 == d)c.log("error MedId son"); else {
            a.loader = {loading: !0};
            var f = b.protocoleWeb + b.UrlBC + "/scripts/interfaceEL.php?mode=SUPPRIMER_MEDIA&UId=" + b.profile.UId + "&MedId=" + d;
            e.post(f).success(function (b, c) {
                a.result = "OK"
            })["finally"](function () {
                a.loader = {loading: !1}
            })
        }
    }, a.getNameMedia = function (a) {
        var b = a.split("."), c = b[1], d = b[0].split("-").pop(), e = "";
        switch (c) {
            case"3gp":
            case"wav":
                e += "Note vocale du ";
                break;
            case"png":
            case"jpg":
                e += "Photo du ";
                break;
            default:
                e += "Media de type " + c + " du "
        }
        var f = new Date(1 * d);
        return e += f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear()
    };
    var j = window.location.hash.split("/")[1], k = j.substring(j.length - 1, j.length);
    "s" != k && (j += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + j).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("GestionClientCtrl", ["$scope", "$http", "$location", "$timeout", "$routeParams", "configSite", "LoginFactory", "ClientsFactory", "baLogs", function (a, b, c, d, e, f, g, h, i) {
    if (g.mustLog())f.msgError = !1, c.path(""); else {
        var j = {mode: "GET_LISTE_PAYS"}, k = f.protocoleWeb + f.UrlBC + "/scripts/interface.php";
        b({url: k, method: "GET", params: j}).success(function (b, c) {
            a.Tpays = b
        }), a.formClient = {}, a.GCId = void 0 != e.GCId ? a.GCId = e.GCId : "", a.title = "" == a.GCId ? {
            titre: "Création d'un nouveau client",
            tag: "create"
        } : {titre: "Modification d'un client", tag: "update"};
        var l = h.getClient(a.GCId);
        null != l && l.then(function (b) {
            a.formClient = b
        }), a.msg = {"class": "", message: ""}, a.submitClient = function () {
            a.msg = {"class": "", message: ""};
            var e = {
                mode: "MODIF_GCLIENT",
                called_function: "validateGClient()",
                civ: a.formClient.civ,
                societe: a.formClient.societe,
                nom: a.formClient.nom,
                prenom: a.formClient.prenom,
                adresse: a.formClient.adresse,
                cp: a.formClient.cp,
                ville: a.formClient.ville,
                pays: a.formClient.pays,
                email: a.formClient.email,
                tel_fixe: a.formClient.tel_fixe,
                tel_port: a.formClient.tel_port,
                fax: a.formClient.fax,
                commentaire: a.formClient.commentaire,
                origine: "ADP",
                UId: f.profile.UId,
                GCId: a.GCId
            }, g = f.protocoleWeb + f.UrlBC + "/scripts/interfaceEL.php";
            b({url: g, method: "GET", params: e}).success(function (b, e) {
                b.id > 0 && "" == a.GCId ? (a.msg = {"class": "alert-success", message: "Ce client a bien été ajouté"}, d(function () {
                    h.resyncClientListe(), c.path("client/" + b.GCId + "/true")
                }, 1e3)) : b.id > 0 && "" != a.GCId ? (a.msg = {"class": "alert-success", message: "Ce client a bien été modifié"}, d(function () {
                    h.resyncClientListe(), c.path("client/" + b.GCId + "/true")
                }, 1e3)) : a.msg = {"class": "alert-danger", message: "Une erreur est survenue lors de l'enregistrement de votre client"}
            })
        }
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("PhotosCtrl", ["$scope", "$http", "$location", "$timeout", "$routeParams", "configSite", "LoginFactory", "MediaFactory", function (a, b, c, d, e, f, g, h) {
    if (g.mustLog())f.msgError = !1, c.path(""); else {
        var i = function (b) {
            null != b && b.then(function (b) {
                a.photos = b, a.nbphotos = b.length
            })
        }, j = function () {
            var b = h.getPhotoEntransfert();
            a.photosTmp = b, a.nbphotosTmp = b.length
        };
        a.loader = h.loader, a.show = !0, a.PrId = void 0 != e.PrId ? e.PrId : "NONE", a.photosTmp = {}, a.nbphotosTmp = 0, a.photos = {}, a.site = f.UrlBC;
        var k = h.getListePhoto(a.PrId);
        i(k), j()
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("SonsCtrl", ["$scope", "$location", "$routeParams", "configSite", "LoginFactory", "MediaFactory", function (a, b, c, d, e, f) {
    if (e.mustLog())d.msgError = !1, b.path(""); else {
        var g = function (b) {
            null != b && b.then(function (b) {
                a.sons = b, a.nbsons = b.length
            })
        }, h = function () {
            var b = f.getAudioEntransfert();
            console.log("liste audio ", b), a.audioTmp = b, a.nbaudioTmp = b.length
        };
        a.loader = f.loader, a.show = !0, a.PrId = void 0 != c.PrId ? c.PrId : "NONE", a.sons = {}, a.site = d.UrlBC, console.log("rrrr");
        var i = f.getListeAudio(a.PrId);
        g(i), h()
    }
}]), angular.module("appliMobileBatiChiffrageApp").controller("NotesCtrl", ["$scope", "LoginFactory", "ProjetsFactory", "configSite", "$location", "$http", "$routeParams", "$timeout", function (a, b, c, d, e, f, g, h) {
    if (b.mustLog())d.msgError = !1, e.path(""); else {
        a.msgNote = {"class": "", message: ""}, a.formNote = {}, a.PrId = void 0 != g.PrId ? g.PrId : "";
        var i = new Date, j = i.getDate(), k = i.getMonth() + 1, l = i.getFullYear(), m = i.getHours(), n = i.getMinutes(), o = {
            mode: "GET_COMMENTAIRE_MOBILE",
            origine: "MOBILE",
            PrId: a.PrId
        }, p = d.protocoleWeb + d.UrlBC + "/scripts/interfaceEL.php";
        f({url: p, method: "POST", params: o}).success(function (b, c) {
            a.formNote = {texte: "le " + j + "/" + k + "/" + l + " à " + m + ":" + n + "\r\n\r\n\r\n\r\n" + b.COMMENTAIRE}
        }), a.submitNote = function () {
            var b = {mode: "SET_COMMENTAIRE_MOBILE", origine: "MOBILE", PrId: a.PrId, commentaire: a.formNote.texte}, c = d.protocoleWeb + d.UrlBC + "/scripts/interfaceEL.php";
            f({url: c, method: "POST", params: b}).success(function (b, c) {
                "#OK#" === b.ETAT && (a.msgNote = {"class": "alert-success", message: "Cette note a bien été ajoutée"}, h(function () {
                    e.path("projet/" + a.PrId)
                }, 1500))
            })
        }
    }
    var q = window.location.hash.split("/")[1], r = q.substring(q.length - 1, q.length);
    "s" != r && (q += "s"), $("#navbar ul li").removeClass("active"), $("#navbar ul li#" + q).addClass("active")
}]), angular.module("appliMobileBatiChiffrageApp").controller("SliderCtrl", ["$scope", "$location", "configSite", "synchro", "LoginFactory", "AppFactory", "baPhoneGap", "baLogs", function (a, b, c, d, e, f, g, h) {
    d.setConfig(c);
    var i = null;
    h.log("############ PATH ", b.path()), null != (i = d.get("login")) && i.then(function (a) {
        if (1 == a.hasAbo) {
            if ("" == a.UId)return;
            e.setProfile(a), b.path("main")
        } else b.path("code")
    });
    var j = "", k = a.slides = [];
    k.push({id: 1, icon: "fa-calculator", image: j + "images/chiffrage2.jpg", text: "Accédez à + de 80 000 prix unitaires de travaux"}), k.push({
        id: 2,
        icon: "fa-list-alt ",
        image: j + "images/carnet2.jpg",
        text: "Consultez vos projets et votre carnet d’adresse clients"
    }), k.push({id: 3, icon: "fa-camera", image: j + "images/photo2.jpg", text: "Rattachez des photos à vos projets"}), k.push({
        id: 4,
        icon: "fa-microphone",
        image: j + "images/son2.jpg",
        text: "Rattachez des messages vocaux à vos projets"
    })
}]), angular.module("appliMobileBatiChiffrageApp").controller("InscriptionCtrl", ["$scope", "$location", "$http", "configSite", "synchro", "LoginFactory", "AppFactory", "baPhoneGap", "baLogs", function (a, b, c, d, e, f, g, h, i) {
    a.formInscription = {}, a.msgtest = {"class": "", message: ""}, a.msgEmailExist = !1, e.setConfig(d);
    var j = null;
    i.log("############ PATH ", b.path()), null != (j = e.get("login")) && j.then(function (a) {
        if (1 == a.hasAbo) {
            if ("" == a.UId)return;
            f.setProfile(a), b.path("main")
        } else b.path("code")
    }), a.formInscription.submitTheForm = function (e, j) {
        var k = h.checkConnection();
        if (10 == k.state)return void g.afficheDemandeCnx();
        a.msgtest = {"class": "", message: ""};
        var l = {mode: "CHECK_EMAIL", email: a.formInscription.email}, m = d.protocoleWeb + d.UrlBC + "/scripts/interface.php";
        c({url: m, method: "GET", params: l}).success(function (e, g) {
            if (console.log(e, "blabla_reponse_CHECK_MAIL"), '"EXIST"' == e)a.msgEmailExist = !0, d.EmailFromInscription = a.formInscription.email, b.path("inscription"); else {
                var h = {
                    mode: "SAVE_PROSPECT",
                    source: "Mobile",
                    origine: "MOBILE",
                    nom: a.formInscription.societe,
                    email: a.formInscription.email,
                    tel1: a.formInscription.tel,
                    MYTLV_nomcontact: a.formInscription.nom,
                    MYTLV_prenomcontact: a.formInscription.prenom
                }, j = d.protocoleWeb + d.UrlBC + "/scripts/interface.php";
                c({url: j, method: "GET", params: h}).success(function (c, d) {
                    i.log("########### DATA CREATION PROSPECT", c), c.id > 0 ? (f.setProfile({
                        authentificated: !0,
                        UId: c.UId,
                        nom: c.user.nom,
                        prenom: c.user.prenom,
                        abonnement: c.user.abonnement
                    }), 0 == f.getNbAbo(c.TAbonnement) ? (i.log("########### REDIRECTION VERS LE CODE"), b.path("code")) : (i.log("########### REDIRECTION VERS LE MAIN"), b.path("main"))) : a.msgtest = {
                        "class": "alert-danger",
                        message: "Une erreur est survenue lors de la création de votre compte"
                    }
                })
            }
        })
    }, a.logout = function () {
        d.profile.authentificated = !1, d.profile.UId = "", d.msgError = !1, e.clearAll(), b.path("")
    }
}]), $(document).ready(function () {
    if ($("body").on("click", ".navbar-collapse a", function () {
            $("#navbar").collapse("hide")
        }), $("body").on("click", "a.navbar-brand", function () {
            $("#navbar").collapse("hide")
        }), $(document).on("click", function (a) {
            var b = $(a.target), c = $(".navbar-collapse").hasClass("navbar-collapse collapse in");
            c !== !0 || b.hasClass("navbar-toggle") || b.hasClass("navbar-brand") || $("#navbar").collapse("hide")
        }), "object" == typeof window.cordova) {
        var a = function (a) {
            var b = a.keyboardHeight, c = window.innerHeight, d = document.activeElement.getBoundingClientRect(), e = document.body.getBoundingClientRect(), f = e.top, g = d.bottom;
            if (console.log(c, b, g, d, e), g >= c - b) {
                console.log("on est sous le clavier", f, jQuery("html, body").height(), jQuery("html, body").height() < b + g + 20, b + g + 20), jQuery("html, body").height() + f < b + g + 20 && (console.log("on agrandi la page"), jQuery("html, body").height(b + g + 20 - f));
                var h = g - (c - b) + 20;
                jQuery("html, body").animate({scrollTop: "+=" + h + "px"})
            }
        }, b = function () {
            var b = angular.element(document.querySelector("body")).injector().get("baPhoneGap");
            b.isAndroid() && window.addEventListener("native.keyboardshow", a)
        };
        b()
    }
});