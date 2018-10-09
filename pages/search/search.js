var e = getApp(), t = require("../../utils/apiUrl.js"), n = require("../../utils/core.js"), r = require("../../utils/page-mixins.js"), a = wx.xstream.Stream, i = {
    5: "w"
}, o = {
    data: {
        list: [],
        renderType: 1,
        isEmpty: !1,
        _keyword: "",
        keyword: "",
        emoji: "><||| ",
        recommendTag: [],
        recommendList: []
    },
    onLoad: function(e) {
        function t(e) {
            r.showErr(e, 3e3, !0);
        }
        var r = this, o = e.keyword, s = a.fromEvent("inputHandler", r), d = a.fromEvent("confirmHandler", r);
        o && this.setData({
            _keyword: o,
            renderType: 2
        }), a.merge(s.debounceTime(300), d, a.of({
            detail: {
                value: o || ""
            }
        })).map(function(e) {
            return e.detail.value.trim();
        }).filter(function(e) {
            return !!e;
        }).distinctUntilChanged().do(function(e) {
            r.showLoading("正在搜索..."), r.setData({
                isEmpty: !1,
                keyword: e
            });
        }).flattenMap(function(e) {
            return a.fromPromise(r.search(e)).pardonError(t);
        }).do(function() {
            return r.hideLoading();
        }).filter(function(e) {
            return !!e;
        }).addListener({
            next: function(e) {
                var t = e.data;
                t.list.forEach(function(e) {
                    return e.count = n.formatCount(e.count, i);
                }), r.setData({
                    list: t.list,
                    isEmpty: !t.list.length
                });
            },
            error: function(e) {
                return r.showErr(e);
            }
        }), s.map(function(e) {
            return !!e.detail.value;
        }).distinctUntilChanged().addListener({
            next: function(e) {
                !e && r.setData({
                    renderType: 1,
                    keyword: ""
                });
            }
        }), d.filter(function(e) {
            return !!e.detail.value;
        }).debug().distinctUntilChanged().addListener({
            next: function() {
                r.setData({
                    renderType: 2
                });
            }
        }), wx.getAppVersion().filter(function(e) {
            return e >= 200;
        }).concatMap(function() {
            return a.fromPromise(r.recommendsSearch()).pardonError(t);
        }).addListener({
            next: function(e) {
                var t = e.data;
                t.lists.forEach(function(e) {
                    return e.count = n.formatCount(e.count, i);
                }), r.setData({
                    recommendList: t.lists,
                    recommendTag: t.recommends
                });
            },
            error: function(e) {
                return r.showErr(e);
            }
        });
    },
    clearKeyword: function() {
        this.setData({
            _keyword: "",
            keyword: "",
            renderType: 1
        });
    },
    changeRenderType2: function() {
        this.setData({
            renderType: 2
        });
    },
    search: function(e) {
        return wx.http.get(t.search, {
            keyword: e,
            channelId: wx.getChannelId()
        });
    },
    openSearch: function(e) {
        wx.redirectTo({
            url: "./search?keyword=" + e.currentTarget.dataset.key
        });
    },
    recommendsSearch: function() {
        return wx.fetchDataWithSession(t.recommendsSearch, {
            channelId: wx.getChannelId()
        });
    },
    sendSearchLog: function(t) {
        e.aldstat.sendEvent("搜索内容", {
            "测试标题": t.currentTarget.dataset.name,
            "关键词": this.data.keyword
        });
    },
    onShareAppMessage: function() {
        return {
            title: "你想找的趣味心理测试这里都有！",
            path: "/pages/search/search?channelId=" + wx.getChannelId(),
            imageUrl: "/asset/images/share-demo.jpg"
        };
    }
};

Page(n.mixins(o, r));