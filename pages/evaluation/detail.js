var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
}, e = getApp(), n = require("../../utils/apiUrl.js"), i = require("../../utils/core.js"), a = require("../../utils/page-mixins.js"), r = wx.xstream, s = r.Stream, o = (r.noop, 
{
    5: {
        unit: "w",
        start: 6
    }
}), u = {
    data: {
        isInit: !1,
        isInitFail: !1,
        isLoading: !1,
        smallTitle: !1,
        shareSize: e.globalData.shareSize,
        lists: []
    },
    onUnload: function() {
        this.timers.forEach(function(t) {
            return clearTimeout(t);
        });
    },
    onLoad: function(e) {
        var n = this;
        if (e && e.id) {
            n.id = e.id, this.timers = [], n.prevRoute = wx.prevRoute, n.showLoading();
            var a = s.of(1).flattenMap(function(t) {
                return s.fromPromise(n.fetchData());
            }).cache();
            s.fromEvent("restartPage", n).startWith(0).do(function(t) {
                return n.setData({
                    isLoading: !0
                });
            }).map(function(t) {
                return a.pardonError(function(t) {
                    n.showErr(t, 3e3, !0), n.hideLoading(), n.setData({
                        isInitFail: !0,
                        isLoading: !1
                    });
                });
            }).flatten().filter(function(t) {
                return !!t;
            }).addListener({
                next: function(e) {
                    var a = e.data;
                    n.hideLoading(), a.detail.count = i.formatCount(a.detail.count, o), n.setData(t({
                        isInit: !0,
                        isInitFail: !1,
                        isLoading: !1,
                        smallTitle: a.detail.name.length > 12
                    }, i.pick(a.detail, [ "id", "count", "name", "introPicture", "shortDescribe" ]))), 
                    n.cropShareImage(a.detail.introPicture), n.pollLingerDuration();
                },
                error: function(t) {
                    return n.showErr(t);
                }
            }), s.fromPromise(n.fetchRecommend()).pardonError().filter(function(t) {
                return !!t;
            }).addListener({
                next: function(t) {
                    var e = t.data;
                    e.lists.forEach(function(t) {
                        return t.count = i.formatCount(t.count, {
                            5: "w"
                        });
                    }), n.setData({
                        lists: e.lists
                    });
                },
                error: function(t) {
                    return n.showErr(t);
                }
            });
        } else n.showToast("缺少测评id");
    },
    fetchData: function() {
        return wx.fetchDataWithSession(n.detail, {
            channelId: wx.getChannelId(),
            id: this.id
        });
    },
    fetchRecommend: function() {
        return wx.fetchDataWithSession(n.recommend, {
            page: 1,
            pageSize: 4,
            id: this.id,
            channelId: wx.getChannelId(),
            from: "detail"
        });
    },
    sendLingerLog: function(t) {
        var n = "直接访问";
        switch (this.prevRoute.route) {
          case "pages/index/index":
            n = "首页";
            break;

          case "pages/search/search":
            n = "搜索页";
            break;

          case "pages/answer/answer-list":
            n = "测试结果页";
        }
        e.aldstat.sendEvent("访问详情页", {
            "来源": n,
            "时长": t,
            "测试标题": this.data.name
        });
    },
    pollLingerDuration: function() {
        var t = this, e = this.timers;
        e.push(setTimeout(function(e) {
            return t.sendLingerLog("<10s");
        }, 5e3)), e.push(setTimeout(function(e) {
            return t.sendLingerLog("10~20s");
        }, 1e4)), e.push(setTimeout(function(e) {
            return t.sendLingerLog(">20s");
        }, 2e4));
    },
    onShareAppMessage: function() {
        var t = this;
        return setTimeout(function() {
            t.shareImagePath = "", t.cropShareImage(t.data.introPicture);
        }, 100), e.aldstat.sendEvent("测试详情页点击分享按钮", {
            "测试标题": this.data.name
        }), {
            title: this.data.name,
            imageUrl: this.shareImagePath,
            path: "/pages/evaluation/detail?id=" + this.id + "&channelId=" + wx.getChannelId(),
            success: function() {
                e.aldstat.sendEvent("成功分享测试详情页", {
                    "测试标题": t.data.name
                });
            }
        };
    }
};

Page(i.mixins(u, a));