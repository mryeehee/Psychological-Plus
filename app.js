function e(e) {
    switch (+e) {
      case 5001:
      case 40023:
      case 40024:
      case 40017:
        return console.log("sessionKeyPastDue"), !0;
    }
    return !1;
}

function n() {
    return wx.fetchDataWithSession(i.saveUserInfo, {
        encryptedData: p.encryptedData,
        ivStr: p.iv
    }, "post");
}

wx.currentAppVersion = "2.0.1", wx.prevAppVersion = "1.0.2", wx.reportSwitch = !0;

var t = require("components/toast/toast.js"), o = require("components/modal/modal.js"), r = require("utils/es6-promise.min.js"), s = require("utils/http.js"), i = require("utils/apiUrl.js"), a = require("utils/xstream.js"), u = require("utils/core.js"), c = (require("./utils/ald-stat.js"), 
u.retry), w = u.extend, l = u.omit, f = u.pick;

wx.toastAPI = t, wx.modalAPI = o, wx.Promise = r, wx.http = s, wx.xstream = a, u.deconstruction = require("utils/deconstruction.js").deconstruction, 
require("utils/xstream.extra.js"), require("utils/wx.promise.js"), require("utils/wx.xstream.js"), 
s.interceptor.push(function(n, t, o) {
    n.data.appCode = n.data.appCode || 2, n.data.appVersoin = wx.currentAppVersion, 
    n.header["content-type"] = "application/x-www-form-urlencoded", o(function(o, s) {
        var i = o.data, a = o.statusCode;
        o.header, o.errMsg;
        return new r(function(o, r) {
            if (200 !== a && 304 !== a || 1 != +i.code) if (e(i.code) && !t.updatedSession) {
                var s = function() {}, u = {};
                t.updatedSession = !0, n.data.encryptedData && n.data.ivStr && (p = null, s = function() {
                    return wx.getUserInfoFlow(!0).then(function(e) {
                        u.encryptedData = e.encryptedData, u.ivStr = e.iv, p = e;
                    });
                }), wx.loginFlow().then(function(e) {
                    return s();
                }).then(function(e) {
                    return wx.fetchDataWithSession(n.url, w(n.data, u), n.method.toLowerCase(), t);
                }).then(o, r);
            } else r(502 == a ? "服务器异常" : i); else o(i);
        });
    });
}), wx.getAppVersion = function() {
    var e = a.Stream;
    return e.merge(e.of(wx.getStorageSync("app_version")).map(function(e) {
        return e || wx.prevAppVersion;
    }), e.fromPromise(s.get(i.version)).map(function(e) {
        return e.data.version;
    }).do(function(e) {
        return wx.setStorage({
            key: "app_version",
            data: e
        });
    })).map(function(e) {
        return +e.replace(/\.*/g, "");
    }).filter(function(e) {
        return !!e;
    }).distinctUntilChanged();
}, wx.__system__info__ = wx.getSystemInfoSync(), wx._hasBeenLowVersionWarn = !!wx.getStorageSync("hasBeenLowVersionWarn"), 
wx.getChannelId = function() {
    return getApp().globalData.channelInfo.channelId;
}, !wx._hasBeenLowVersionWarn && wx.__system__info__.SDKVersion && +wx.__system__info__.SDKVersion.replace(/\./g, "") < 120 && (wx.setStorage({
    key: "hasBeenLowVersionWarn",
    data: "1"
}), wx.showModal({
    title: "提示",
    content: "您的微信版本过低，该小程序可能无法正常提供服务。",
    showCancel: !1
})), wx._hasBeenLowVersionWarn = !0, wx.fetchDataWithSession = function(e, n, t, o) {
    var r = o ? o.retry || 0 : 0, o = l(o || {}, [ "retry" ]);
    return c(function() {
        return wx.insureLogined().then(function(r) {
            return wx.http[t || "get"](e, w({}, n, {
                sessionKey: r.data
            }), o);
        });
    })(r);
}, wx.loginCpSystem = function(e) {
    var n = getApp();
    return wx.http.get(i.getCpSysInfo, w({
        nickname: n.globalData.userInfo ? n.globalData.userInfo.nickname || "亲爱的" : "亲爱的",
        sessionKey: wx.getStorageSync("sessionKey"),
        channelId: wx.getChannelId()
    }, f(e, [ "channelId", "username", "password", "requestLoginSource", "orderId", "enterFrom", "userKey" ])));
}, wx.loginFlow = function() {
    return new r(function(e, n) {
        wx.login({
            success: function(t) {
                return wx.http.get(i.getSessionKey, {
                    jsCode: t.code
                }).then(function(n) {
                    var t = {
                        data: n.data.sessionKey
                    };
                    wx.setStorageSync("sessionKey", t.data), p ? (p = null, wx.getUserInfoFlow().catch(function(e) {
                        return !0;
                    }).then(function(n) {
                        return e(t);
                    })) : e(t);
                }, n);
            },
            fail: n
        });
    });
}, wx.insureLogined = function() {
    return new r(function(e, n) {
        function t() {
            wx.loginFlow().then(e, n);
        }
        wx.getStorageSync("sessionKey") ? wx.checkSession({
            success: function() {
                wx.getStorage({
                    key: "sessionKey",
                    success: e,
                    fail: t
                });
            },
            fail: t
        }) : t();
    });
};

var p = null;

wx.getUserInfoFlow = function(e) {
    return new r(function(t, r) {
        function s(o) {
            var s = getApp().globalData;
            w(s.userInfo, o.userInfo), o.iv && !e ? p ? t(p = o) : (p = o, n().then(t, r)) : t(o);
        }
        wx.getUserInfo({
            withCredentials: !0,
            success: function(e) {
                return s(e);
            },
            fail: function() {
                var e = getCurrentPages();
                e = e[e.length - 1], o.show(e, "modalConfig", {
                    content: "我们需要一些你公开的基础信息（如昵称），才能将测评与你的账号关联。",
                    onUserClose: r,
                    buttons: [ {
                        text: "取消",
                        behavior: function(e) {
                            r(), e();
                        }
                    }, {
                        text: "去授权",
                        behavior: function(n) {
                            wx.openSetting ? wx.openSetting({
                                success: function(e) {
                                    e.authSetting["scope.userInfo"] && wx.getUserInfo({
                                        withCredentials: !0,
                                        success: function(e) {
                                            s(e), n();
                                        },
                                        fail: r
                                    });
                                },
                                fail: r
                            }) : (r(), wx.modalAPI.show(e, "modalConfig100", {
                                content: "请从右上角【•••】->【关于壹心理专业测试】->右上角【•••】->【设置】进入设置界面，开启授权后重试。",
                                buttons: [ {
                                    text: "明白了",
                                    behavior: "close"
                                } ]
                            }));
                        }
                    } ]
                });
            }
        });
    });
}, App({
    globalData: {
        userInfo: {},
        channelInfo: {
            channelId: 394
        },
        shareSize: {
            width: 720,
            height: Math.ceil(720 * (/ios/i.test(wx.__system__info__.system) ? .8 : 168 / 215))
        }
    },
    onLaunch: function() {
        wx.loginFlow();
    },
    toastAPI: t,
    modalAPI: o,
    Promise: r
});