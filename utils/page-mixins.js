var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, t = require("./core.js"), n = require("./apiUrl.js"), o = wx.xstream.Stream;

module.exports = t.extend(t.pick(t, [ "showErr", "showToast", "showLoading", "hideLoading", "reportLog" ]), {
    onShow: function() {
        var e = this;
        setTimeout(function() {
            return wx.prevRoute = t.pick(e, [ "route" ]);
        });
    },
    onLoad: function() {
        var e = this;
        wx.getAppVersion().addListener({
            next: function(t) {
                return e.setData({
                    appVersion: t
                });
            }
        });
    },
    fetchChannelInfo: function() {
        return wx.http.get(n.channelInfo, {
            channelId: wx.getChannelId()
        }, {
            retry: 2
        }).then(function(e) {
            var t = e.data;
            return t.channelMsg.id = t.channelId, t;
        });
    },
    cropShareImage: function(e) {
        var n = this;
        wx.__system__info__.SDKVersion && +wx.__system__info__.SDKVersion.replace(/\./g, "") >= 150 && wx.getImageInfoStream(e).do(function(e) {
            var o = wx.createCanvasContext("share");
            t.extend(e, t.scale(e.width, e.height, n.data.shareSize.width, n.data.shareSize.height)), 
            o.drawImage(e.path, -Math.ceil((e.width - n.data.shareSize.width) / 2), 0, e.width, e.height), 
            o.draw();
        }).delay(200).flattenMap(function() {
            return o.fromPromise(wx.canvasToTempFilePathPr("share"));
        }).addListener({
            next: function(e) {
                n.shareImagePath = e, console.log(e);
            },
            error: function(e) {
                return n.showErr(e);
            }
        });
    },
    intelligenceJump: function(t, n) {
        var o;
        "object" === (void 0 === t ? "undefined" : e(t)) && (o = t.currentTarget.dataset.id, 
        n = t.currentTarget.dataset.openType), o ? this.jumpAPP(o) : this.jumpDetail(t, n);
    },
    jumpH5: function(e) {
        wx.insureLogined().then(function() {
            wx.loginFlow().then(function(n) {
                var o = t.json2Form({
                    dataUrl: e + "&appCode=1&sessionKey=" + wx.getStorageSync("sessionKey")
                });
                wx.navigateTo({
                    url: "../report/report_web?" + o
                });
            });
        });
    },
    jumpDetail: function(e, t) {
        wx[t ? t + "To" : "redirectTo"]({
            url: "string" == typeof e ? e : e.currentTarget.dataset.url
        });
    },
    jumpAPP: function(t, n) {
        "object" === (void 0 === t ? "undefined" : e(t)) && (t = t.currentTarget.dataset.id), 
        (t || n) && (wx.navigateToMiniProgram ? wx.navigateToMiniProgram({
            appId: "wx6af8012f6e5eeda0",
            path: n ? n.url : "pages/evaluation/detail?scalePoolId=" + t + "&channelId=" + wx.getChannelId(),
            extraData: {},
            envVersion: "develop",
            fail: function(e) {
                this.showErr(e);
            }
        }) : wx.modalAPI.show(this, "modalConfigApp", {
            content: n ? n.msg : "目前仅支持版本号6.5.21及以上的微信客户端完成购买，囧",
            buttons: [ {
                text: "我知道了",
                behavior: "close"
            } ]
        }));
    },
    tmpCommand: [],
    batching: function() {
        this.tmpCommand.length && this.setData(t.extend.apply(null, this.tmpCommand.splice(0)));
    }
});