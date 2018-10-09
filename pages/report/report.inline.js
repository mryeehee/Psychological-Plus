function t(t, e, n) {
    p ? t.setData(e, n) : (t.setData(e), setTimeout(n, 50));
}

function e(e, n) {
    return new m(function(r) {
        t(n, {
            queryRowText: e
        }, function() {
            wx.createSelectorQuery().select("#test-chart-row").fields({
                size: !0
            }, r).exec();
        });
    });
}

function n(t) {
    return wx.createAnimation({
        timingFunction: "ease-out",
        duration: void 0 === t ? 300 : t
    });
}

function r(t, e) {
    var r = n(e || 0);
    return r.translateY(t).scale(e ? 1 : .8).opacity(e ? 1 : 0).step(), r.export();
}

function o() {
    var t = [ "测试小达人" ];
    return {
        userInfo: {
            avatarUrl: "/asset/images/default-pic.png",
            nickName: t[Math.floor(Math.random() * t.length)]
        }
    };
}

var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, i = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
}, s = function() {
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
}(), c = getApp(), u = require("../../utils/apiUrl.js"), l = require("../../utils/core.js"), f = wx.xstream, d = f.Stream, h = f.noop, m = wx.Promise, p = wx.__system__info__.SDKVersion && +wx.__system__info__.SDKVersion.replace(/\./g, "") >= 150, g = Math.floor(17.8), x = Math.floor((c.globalData.shareSize.height - 88) / 58), w = {
    5: "w"
};

module.exports = {
    data: {
        lists: [],
        isRecommendLoading: !1,
        recommendPage: 0,
        totalPage: 1 / 0,
        userInfo: {
            avatarUrl: "/asset/images/default-pic.png",
            nickName: ""
        },
        descMaxHeight: 0,
        oneLine: !1,
        isShowModal: !1,
        isShowProgress: !1,
        progressVal: 0,
        canvas: {
            width: 0,
            height: 0
        },
        cardMaxHeight: wx.__system__info__.windowHeight - (wx.__system__info__.screenWidth < 360 ? 40 : 66),
        qrcodeBoxWrapHeight: 146,
        smallScreen: wx.__system__info__.screenWidth < 360
    },
    initReportTask: function() {
        var t, e, n, r, a = this;
        t = d.create({
            start: function(t) {
                wx.downloadFileStream(a.data.result.resultPic).endWhen(d.periodic(4e4).take(1)).do(function(t) {
                    t.tempFilePath ? n && n.complete() : n && n.next(t.progress);
                }).filter(function(t) {
                    return !!t.tempFilePath;
                }).addListener({
                    next: function(e) {
                        t.next(e);
                    },
                    complete: function() {
                        t.error({
                            errMsg: "下载超时"
                        });
                    },
                    error: function(e) {
                        return t.error(e);
                    }
                });
            },
            stop: h
        }).cache(), d.create({
            start: function(t) {
                n = t;
            },
            stop: function() {
                n = null;
            }
        }).throttleTime(400).addListener({
            next: function(t) {
                a.setData({
                    progressVal: t
                });
            }
        }), e = d.fromPromise(wx.getUserInfoPr()).replaceError(function(t) {
            return d.of(o());
        }).cache(), d.combine(t, e).flattenMap(function(t) {
            var e = s(t, 2), n = e[0], r = e[1].userInfo;
            return d.fromPromise(m.all([ wx.getImageInfoPr(n.tempFilePath), wx.getImageInfoPr(r.avatarUrl).then(function(t) {
                return i({}, t, {
                    nickName: r.nickName
                });
            }) ]));
        }).cache(), d.create({
            start: function(t) {
                d.fromPromise(wx.canvasToTempFilePathPr("result-canvas")).addListener(t);
            },
            stop: h
        }).cache(), r = d.fromEvent("saveToAlbum", this), t.addListener({
            error: function() {
                return a.setData({
                    progressVal: 0
                });
            }
        }), e.addListener({
            next: function(t) {
                var e = t.userInfo;
                a.setData({
                    userInfo: e
                });
            },
            error: function(t) {
                return a.showErr(t);
            }
        });
        var u = r.filter(function() {
            return !a.isExporting;
        }).do(function() {
            a.isExporting = !0, c.aldstat.sendEvent("测试结果页点击保存按钮", {
                "测试标题": a.data.name
            }), 100 !== a.data.progressVal && a.setData({
                isShowProgress: !0
            });
        }).flattenMap(function() {
            return t.replaceError(function(t) {
                return d.of(t);
            });
        }).partition(function(t) {
            return !!t.tempFilePath;
        });
        u[0].do(function() {
            a.showLoading("正在生成图片..."), a.setData({
                isShowProgress: !1,
                progressVal: 100
            });
        }).flattenMap(function(t) {
            return wx.getSettingStream().map(function(e) {
                return [ t, e ];
            }).pardonError(function(t) {
                a.showErr(t, 3e3, !0), a.isExporting = !1, a.hideLoading();
            });
        }).filter(function(t) {
            return !!t;
        }).do(function() {
            return a.hideLoading();
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var e = s(t, 2), n = e[0].tempFilePath, r = e[1];
                a.isExporting = !1, !1 === r.authSetting["scope.writePhotosAlbum"] ? wx.previewImage({
                    urls: [ n ]
                }) : wx.saveImageToPhotosAlbum({
                    filePath: n,
                    success: function() {
                        a.showToast("保存成功"), c.aldstat.sendEvent("成功保存测试结果", {
                            "测试标题": a.data.name
                        });
                    },
                    fail: function(t) {
                        return !/cancel|deny/.test(t.errMsg) && a.showErr(t, 3e3, !0);
                    }
                });
            },
            error: function(t) {
                return a.showErr(t);
            }
        }), u[1].addListener({
            next: function(t) {
                a.showErr(t, 3e3, !0), a.isExporting = !1, a.setData({
                    isShowProgress: !1,
                    progressVal: 0
                });
            }
        }), d.create({
            start: function(t) {
                a.reachBottom$prod = t;
            },
            stop: h
        }).filter(function() {
            var t = a.data;
            return !t.isLoading && t.recommendPage < t.maxPage;
        }).map(function() {
            return a.data.recommendPage;
        }).startWith(0).do(function() {
            return a.setData({
                isLoading: !0
            });
        }).flattenMap(function(t) {
            return d.fromPromise(a.fetchRecommend(t + 1)).pardonError(function(t) {
                a.showErr(t, 3e3, !0), a.setData({
                    isLoading: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var e = t.data;
                e.lists.forEach(function(t) {
                    return t.count = l.formatCount(t.count, w);
                }), a.setData({
                    isLoading: !1,
                    lists: a.data.lists.concat(e.lists),
                    recommendPage: a.data.recommendPage + 1,
                    maxPage: e.totalPage
                });
            },
            error: function(t) {
                return a.showErr(t);
            }
        }), wx.getElementInfoStream("#qrcode-box-wrap").withLatestFrom(wx.getElementInfoStream("#report-desc-wrap--modal")).addListener({
            next: function(t) {
                var e = s(t, 2), n = e[0], r = e[1];
                a.setData({
                    qrcodeBoxWrapHeight: n.height,
                    descMaxHeight: n.top - r.top - 10
                });
            },
            error: function() {
                a.setData({
                    qrcodeBoxWrapHeight: 100,
                    descMaxHeight: 200
                });
            }
        }), wx.getElementInfoStream("#qrcode-box__title").withLatestFrom(wx.getElementInfoStream("#qrcode-box__title-text")).addListener({
            next: function(t) {
                t[0].height < 30 && t[0].width - t[1].width > 3 * a.data.result.title.length && a.setData({
                    oneLine: !0
                });
            }
        }), wx.setNavigationBarTitle && wx.setNavigationBarTitle({
            title: "测试结果"
        }), this.shareImagePath = void 0, wx.createSelectorQuery && this.drawShareContent(e), 
        this.userInfo$ = e;
    },
    deployReportTask: function() {
        this.setData({
            reportAnimation: r(400),
            recommendAnimation: r(400)
        });
    },
    showModal: function() {
        this.setData({
            isShowModal: !0
        });
    },
    hideModal: function() {
        this.setData({
            isShowModal: !1
        });
    },
    maskHandler: function(t) {
        "report-box-wrap" == t.target.id && this.hideModal();
    },
    fetchRecommend: function(t) {
        return wx.fetchDataWithSession(u.recommend, {
            page: t,
            pageSize: 20,
            id: this.id,
            channelId: wx.getChannelId(),
            from: "result"
        });
    },
    fetchResult: function(t) {
        return wx.fetchDataWithSession(u.getResult, {
            resultId: t,
            channelId: wx.getChannelId()
        });
    },
    enter: function() {
        this.setData({
            reportAnimation: r(0, 350),
            recommendAnimation: r(0, 350)
        });
    },
    drawShareContent: function(t) {
        function n(t) {
            return d.fromPromise(e(t, r)).replaceError(function() {
                return d.of(29);
            });
        }
        var r = this, o = this.data, i = Date.now(), s = wx.createCanvasContext("share"), c = 1;
        s.clearRect(0, 0, o.shareSize.width, o.shareSize.height), d.merge(d.of({
            type: "head",
            content: "测试结果：" + o.result.title
        }), d.fromArray(o.result.content.split("\r\n")).filter(function(t) {
            return !!t;
        }).map(function(t) {
            function e(r) {
                return n(t.slice(o, o + r)).map(function(t) {
                    return r >= a - o ? d.of(r) : t.height > 34 ? d.of(r - 1) : e(r + 1);
                }).concat();
            }
            var r, o = 0, a = t.length;
            return d.create({
                start: function(t) {
                    (r = t).next(g);
                },
                stop: h
            }).map(function(t) {
                return e(t);
            }).concat().map(function(e) {
                return t.slice(o, o + e);
            }).do(function(t) {
                (o += t.length) < a ? r.next(g) : r.complete();
            });
        }).concat().take(x)).addListener({
            next: function(t) {
                "object" === (void 0 === t ? "undefined" : a(t)) ? (s.save(), "head" == t.type ? (s.setFontSize(48), 
                s.setTextBaseline("top"), s.setFillStyle("#000000"), s.fillText(t.content, 4, 20)) : (-1 == t.path.indexOf("//") && (t.path = "/" + t.path), 
                s.setFontSize(44), s.setTextBaseline("middle"), s.setFillStyle("#666666"), s.drawImage(t.path, 4, 28, 100, 100), 
                s.fillText(t.nickName, 124, 78)), s.restore()) : (c === x && t.length >= g && (t = t.slice(0, -2) + "......"), 
                s.setFontSize(40), s.setTextBaseline("middle"), s.setFillStyle("#666666"), s.fillText(t, 4, 64 + 58 * c), 
                ++c);
            },
            complete: function() {
                s.draw(), r.setData({
                    totalTime: Date.now() - i
                }), setTimeout(function() {
                    return wx.canvasToTempFilePathPr("share").then(function(t) {
                        return r.shareImagePath = t;
                    });
                }, 100);
            },
            error: function(t) {
                console.error(t);
            }
        });
    },
    onReachBottom: function(t) {
        this.reachBottom$prod && this.reachBottom$prod.next(t);
    }
};