function t(t, a) {
    e.aldstat.sendEvent("查看列表", {
        "分页加载次数": t,
        "列表所在分类": a
    });
}

var a = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var e = arguments[a];
        for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
    }
    return t;
}, e = getApp(), n = require("../../utils/apiUrl.js"), r = require("../../utils/core.js"), o = require("../../utils/page-mixins.js"), i = require("../../components/loading-animation/index.js"), s = wx.xstream, c = s.Stream, u = s.noop, d = {
    5: "w"
}, f = {
    data: {
        frontAnimate: null,
        hotPage: 1,
        hotMaxPage: 0,
        showShadow: !0,
        appVersion: 200,
        latest: [],
        categories: [],
        lists: [],
        isInit: !1,
        fixCategory: !1,
        activeCategoryName: "全部",
        activeCategoryCount: "--",
        isInitFail: !1,
        isLoading: !1,
        isMoreEnd: !1,
        currentPage: 1,
        maxPage: 1 / 0
    },
    onPageScroll: function(t) {
        this.scroll$prod && this.scroll$prod.next(t.scrollTop);
    },
    onReachBottom: function(t) {
        this.reachBottom$prod && this.reachBottom$prod.next(t);
    },
    onLoad: function() {
        function n(t) {
            return t % o.data.hotMaxPage || 4;
        }
        e.aldstat.sendEvent("访问首页"), new i(this, "loadingAnimationConfig1").start(), new i(this, "loadingAnimationConfig2").start();
        var o = this, s = !1, f = (wx.getDomInfoPr("#hot-category"), 0);
        o.showLoading("正在加载...");
        var g, l, h, m;
        h = c.fromEvent("changeCategory", o), m = c.fromEvent("refreshHot", o), g = c.of(1).flattenMap(function(t) {
            return c.fromPromise(o.fetchData());
        }).cache(), l = c.of(628), c.fromEvent("restartPage", o).startWith(0).do(function(t) {
            return o.setData({
                isLoading: !0
            });
        }).flattenMap(function(t) {
            return g.pardonError(function(t) {
                o.showErr(t, 3e3, !0), o.hideLoading(), o.setData({
                    isLoading: !1,
                    isInitFail: !0
                });
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var e = t.data, n = e.latest.length / 3;
                e.lists.forEach(function(t) {
                    return t.count = r.formatCount(t.count, d);
                }), e.latest = e.latest.slice(0, e.latest.length - e.latest.length % 3), o.hideLoading(), 
                o.setData(a({
                    isInit: !0,
                    isLoading: !1,
                    isInitFail: !1,
                    activeCategoryCount: e.totalNum,
                    maxPage: e.totalPage,
                    hotMaxPage: n,
                    frontLatest: e.latest.slice(0, 3)
                }, r.pick(e, [ "latest", "categories", "lists" ])));
            },
            error: function(t) {
                return o.showErr(t);
            }
        }), h.filter(function() {
            return !!wx.pageScrollTo;
        }).flattenMap(function() {
            return l;
        }).do(function(t) {
            o.setData({
                showShadow: !1
            }), setTimeout(function() {
                wx.pageScrollTo({
                    scrollTop: t - 138
                });
            });
        }).delay(400).addListener({
            next: function(t) {
                o.setData({
                    showShadow: !0
                });
            },
            error: function(t) {
                return o.showErr(t);
            }
        }), h.map(function(t) {
            return t.currentTarget.dataset.name;
        }).distinctUntilChanged(function(t, a) {
            return t === a;
        }).do(function(t) {
            o.showLoading("正在加载..."), e.aldstat.sendEvent("查看分类", {
                "分类名称": t
            });
        }).flattenMap(function(t) {
            return c.fromPromise(o.fetchCategory(t, 1)).map(function(a) {
                return {
                    json: a,
                    name: t
                };
            }).pardonError(function(t) {
                o.showErr(t, 3e3, !0), o.hideLoading();
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var a = t.json, e = t.name, n = a.data;
                n.lists.forEach(function(t) {
                    return t.count = r.formatCount(t.count, d);
                }), o.hideLoading(), o.setData({
                    lists: n.lists,
                    activeCategoryName: e,
                    activeCategoryCount: n.totalNum,
                    currentPage: 1,
                    maxPage: n.totalPage
                });
            },
            error: function(t) {
                return o.showErr(t);
            }
        }), c.create({
            start: function(t) {
                o.reachBottom$prod = t;
            },
            stop: u
        }).filter(function(t) {
            var a = o.data;
            return !a.isLoading && a.currentPage < a.maxPage;
        }).do(function(a) {
            var e = o.data;
            switch (e.currentPage) {
              case 1:
                t("<3次", e.activeCategoryName);
                break;

              case 3:
                t("3~5次", e.activeCategoryName);
                break;

              case 5:
                t(">5次", e.activeCategoryName);
            }
            o.setData({
                isLoading: !0
            });
        }).flattenMap(function(t) {
            return c.fromPromise(o.fetchCategory(o.data.activeCategoryName, o.data.currentPage + 1)).pardonError(function(t) {
                o.showErr(t, 3e3, !0), o.setData({
                    isLoading: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var a = t.data;
                a.lists.forEach(function(t) {
                    return t.count = r.formatCount(t.count, d);
                }), o.setData({
                    isLoading: !1,
                    lists: o.data.lists.concat(a.lists),
                    currentPage: o.data.currentPage + 1,
                    maxPage: a.totalPage
                });
            },
            error: function(t) {
                return o.showErr(t);
            }
        }), c.create({
            start: function(t) {
                o.scroll$prod = t;
            },
            stop: u
        }).do(function(t) {
            f = t, t < 36 ? (s && wx.setNavigationBarTitle && wx.setNavigationBarTitle({
                title: " "
            }), s = !1) : (!s && wx.setNavigationBarTitle && wx.setNavigationBarTitle({
                title: "壹心理测试+"
            }), s = !0);
        }).flattenMap(function(t) {
            return l.map(function(a) {
                return a - t;
            });
        }).map(function(t) {
            return t < 138;
        }).filter(function(t) {
            return t !== o.data.fixCategory;
        }).addListener({
            next: function(t) {
                o.setData({
                    fixCategory: t
                });
            },
            error: function(t) {
                return o.showErr(t);
            }
        }), m.throttleTime(400).map(function() {
            return o.data.hotPage % 2;
        }).do(function(t) {
            var a = wx.createAnimation({
                duration: 100
            }), e = wx.createAnimation({
                duration: 100
            });
            a.scale(.96).step(), e.opacity(1).step(), o.setData({
                frontLoadingVisible: !0
            }), setTimeout(function() {
                o.setData({
                    frontAnimate: a.export(),
                    frontLoadingAnimation: e.export(),
                    hotPage: n(o.data.hotPage + 1)
                });
            });
        }).delay(100).do(function(t) {
            var a = o.data, e = a.latest, r = a.hotPage, i = (a.hotMaxPage, n(r) - 1);
            o.setData({
                frontLatest: e.slice(3 * i, 3 * i + 3)
            });
        }).delay(100).do(function(t) {
            var a = wx.createAnimation({
                duration: 100
            }), e = wx.createAnimation({
                duration: 100
            });
            a.scale(1).step(), e.opacity(0).step(), o.setData({
                frontAnimate: a.export(),
                frontLoadingAnimation: e.export()
            });
        }).delay(100).addListener({
            next: function(t) {
                o.setData({
                    frontLoadingVisible: !1
                });
            }
        });
    },
    jumpSearch: function() {
        wx.navigateTo({
            url: "/pages/search/search"
        });
    },
    fetchData: function() {
        return wx.http.get(n.homePage, {
            channelId: wx.getChannelId()
        });
    },
    sendLogAndOpen: function(t) {
        var a = t.currentTarget.dataset, n = a.name, r = a.id, o = a.url, i = a.hfiveurl;
        e.aldstat.sendEvent("“新鲜测试”点击情况", {
            "测试标题": n
        }), i ? this.jumpH5(i) : r ? this.jumpAPP(r) : this.jumpDetail(o, "navigate");
    },
    fetchCategory: function(t, a) {
        return wx.http.get(n.category, {
            page: a,
            pageSize: 20,
            channelId: wx.getChannelId(),
            appCode: t.length > 2 ? 2 : 1,
            category: t
        });
    },
    onShareAppMessage: function() {
        return {
            title: Math.random() > .5 ? "壹心理测试+，免费、好玩的心理测试大全！" : "史上最全的免费心理测试，不好玩你找我",
            path: "/pages/index/index?channelId=" + wx.getChannelId(),
            imageUrl: "/asset/images/share-demo.jpg"
        };
    }
};

Page(r.mixins(f, o));