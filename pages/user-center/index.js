var t = function() {
    function t(t, e) {
        var n = [], r = !0, o = !1, a = void 0;
        try {
            for (var i, s = t[Symbol.iterator](); !(r = (i = s.next()).done) && (n.push(i.value), 
            !e || n.length !== e); r = !0) ;
        } catch (t) {
            o = !0, a = t;
        } finally {
            try {
                !r && s.return && s.return();
            } finally {
                if (o) throw a;
            }
        }
        return n;
    }
    return function(e, n) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return t(e, n);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, n = getApp(), r = require("../../utils/core.js"), o = require("../../utils/apiUrl.js"), a = require("../../utils/moment.js"), i = require("../../utils/page-mixins.js"), s = require("../../components/loading-animation/index.js"), u = wx.xstream.Stream, l = {
    5: "w"
};

Page(r.mixins({
    data: {
        type: "1",
        list: [],
        hasErr: !1,
        loading: !1,
        userInfo: n.globalData.userInfo,
        smallScreen: wx.__system__info__.screenWidth < 360
    },
    copyOrderCode: function(t) {
        var e = this;
        r.invoke("setClipboardData", {
            data: t.currentTarget.dataset.code,
            success: function() {
                e.showToast("复制成功");
            },
            fail: function() {
                e.showToast("复制失败");
            }
        });
    },
    fetchDetail: function(t) {
        return t = t || this.data.type, wx.fetchDataWithSession(o.getMyScale, {
            channelId: n.globalData.channelInfo.channelId,
            appCode: t,
            isFun: +(2 == t)
        });
    },
    jumpCeAPP: function(t) {
        "object" === (void 0 === t ? "undefined" : e(t)) && (t = t.currentTarget.dataset.url), 
        this.jumpAPP(!1, {
            url: t + "&channelId=" + wx.getChannelId(),
            msg: "因微信功能限制，版本号6.5.21及以上的微信客户端才能跳转。"
        });
    },
    onLoad: function() {
        function o(t) {
            wx.stopPullDownRefresh && wx.stopPullDownRefresh(), t && i.showErr(t, 3e3, !0), 
            i.hideLoading(), i.setData({
                loading: !1,
                hasErr: !!t
            });
        }
        var i = this;
        new s(this, "loadingAnimationConfig").start();
        var c = u.fromEvent("switchTab", i).map(function(t) {
            return "object" == (void 0 === t ? "undefined" : e(t)) ? t.currentTarget.dataset.key : t;
        }).startWith("1");
        c.do(function(t) {
            i.showLoading("正在加载..."), i.setData({
                loading: !0,
                type: t
            });
        }).flattenMap(function(t) {
            return u.fromPromise(wx.getUserInfoFlow()).mapTo(t).pardonError(o);
        }).filter(function(t) {
            return !!t;
        }).do(function() {
            return i.setData({
                userInfo: n.globalData.userInfo
            });
        }).flattenMap(function(e) {
            return u.fromPromise(i.fetchDetail(e)).pardonError(function(t) {
                o(t), i.setData({
                    list: []
                });
            }).filter(function(t) {
                return !!t;
            }).withLatestFrom(c).map(function(e) {
                var i = t(e, 2), s = i[0].data, u = i[1], c = s.comboAndScales || s.funScales;
                return o(), "2" == u ? c.forEach(function(t) {
                    return t.testerTotal = r.formatCount(t.testerTotal, l);
                }) : c.forEach(function(t) {
                    var e = r.json2Form({
                        dataUrl: t.dataUrl + "&appCode=" + n.globalData.channelInfo.channelId
                    });
                    t.state ? (t.completeTime = a(t.completeTime).format("YYYY年MM月DD日 hh:mm"), t.computedReportUrl = "/pages/report/report_web?" + e) : (t.buyTime = a(t.buyTime).format("YYYY年MM月DD日 hh:mm"), 
                    t.computedUrl = "/pages/answer/answerList/answerList?" + e);
                }), c;
            }).concatMap(function(t) {
                var e = t.length;
                return e > 15 ? u.periodic(600).take(Math.floor(e / 15)).startWith(-1).map(function(n) {
                    return t.slice(0, Math.min(15 * (n + 2), e));
                }) : u.of(t);
            });
        }).debug().addListener({
            next: function(t) {
                i.setData({
                    list: t
                });
            },
            error: function(t) {
                return console.error(t);
            }
        });
    },
    onPullDownRefresh: function() {
        this.switchTab(this.data.type);
    }
}, i));