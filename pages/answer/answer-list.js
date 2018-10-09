function t(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

function e(t) {
    return t.replace(p, "").replace(l, "");
}

function n(t) {
    return wx.createAnimation({
        timingFunction: "ease-out",
        duration: void 0 === t ? 300 : t
    });
}

function i(t, e) {
    var i = n(e || 0);
    return i.translateY(t).step(), i.export();
}

var r = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
}, o = getApp(), a = require("../../utils/apiUrl.js"), s = require("../../utils/core.js"), u = require("../report/report.inline.js"), d = require("../../utils/page-mixins.js"), c = require("../../utils/wxParse/wxDiscode.js"), f = require("../../components/test-question/index.js"), p = /<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/g, l = /<\/([-A-Za-z0-9_]+)[^>]*>/g, h = wx.xstream.Stream, x = "#active-question > .slider-view-body > .question-item > .question-body-wrap", w = {
    width: 500,
    height: 280
}, g = wx.Promise, m = {
    data: {
        indexTexts: function() {
            for (var t = [], e = 0; e < 20; e++) t.push(String.fromCharCode(65 + e));
            return t;
        }(),
        counterAnimation: null,
        activeIndex: 0,
        source: [],
        isInit: !1,
        isInitFail: !1,
        isLoading: !1,
        isAdvance: !1,
        isReportReady: !1,
        isQuestionReady: !1,
        isSending: !1,
        shareSize: o.globalData.shareSize,
        scaleId: !0
    },
    answerStack: [],
    freeAnswer: [],
    onLoad: function(n) {
        function a(t) {
            d.showErr(t, 3e3, !0);
        }
        var u = this, d = this, f = Date.now();
        n && n.id ? (d.id = n.id, d.resultId = n.resultId, d.resultId && d.setData({
            scaleId: !1
        })) : d.showToast("缺少测评id");
        var p, l, w, m;
        p = h.of(1).flattenMap(function(t) {
            return h.fromPromise(d.fetchQuestion());
        }).cache(), l = h.create({
            start: function(t) {
                d.answer$prod = t;
            },
            stop: function() {
                d.answer$prod = null;
            }
        }).filter(function(t) {
            return !d.data.isSending;
        }), w = h.fromEvent("submit", this).filter(function(t) {
            return !d.data.isSending && d.data.source[d.data.activeIndex].isAnswerCompletion;
        }).do(function(t) {
            d.setData({
                isSending: !0
            }), d.showLoading("正在提交..."), o.aldstat.sendEvent("提交答案", {
                "测试标题": d.data.name
            });
        }).flattenMap(function(t) {
            return h.fromPromise(d.submitAnswer()).pardonError(function(t) {
                a("服务器跪了，请再次提交或重新答题"), d.hideLoading(), d.setData({
                    isSending: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        }), d.resultId || (h.create({
            start: function(t) {
                m = t;
            },
            stop: function() {}
        }).warpGroup(function() {
            return h.never();
        }, 4).addListener({
            next: function(t) {
                d.reportLog("answer_log", s.extend.apply(null, t));
            }
        }), h.fromEvent("restartPage", d).filter(function(t) {
            return !d.data.isLoading;
        }).startWith(0).do(function(t) {
            d.setData({
                isLoading: !0
            }), m.next({
                id: d.id
            }), m.next({
                http_before: Date.now() - f
            }), f = Date.now();
        }).flattenMap(function(t) {
            return p.pardonError(function(t) {
                a(t), d.hideLoading(), d.setData({
                    isInitFail: !0,
                    isLoading: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var n = t.data;
                m.next({
                    http: Date.now() - f
                }), f = Date.now(), n.questions[n.questions.length - 1].isLastQuestion = !0, n.questions.forEach(function(t, n) {
                    t.index = n + 1, t.title = c.strDiscode(e(t.title)), t.options.forEach(function(t) {
                        t.title = c.strDiscode(e(t.title));
                    });
                }), d.hideLoading(), d.setData({
                    isInit: !0,
                    isInitFail: !1,
                    isQuestionReady: !0,
                    source: n.questions,
                    name: n.title,
                    introPicture: n.introPicture
                }, function() {
                    m.next({
                        render: Date.now() - f
                    }), f = Date.now();
                }), o.aldstat.sendEvent("开始测试", {
                    "测试标题": n.title
                }), wx.setNavigationBarTitle && wx.setNavigationBarTitle({
                    title: n.title
                }), d.initCard(), d.cropShareImage(n.introPicture), setTimeout(function() {
                    return d.updateOptionContext();
                }, 100), setTimeout(function(t) {
                    return d.deployReportTask();
                }, 500);
            },
            error: function(t) {
                return d.showErr(t);
            }
        }), l.filter(function(t) {
            var e = t.option;
            return "jump" !== e.type || !!e.nextQuestionId;
        }).addListener({
            next: function(t) {
                var e = t.option, n = d.data.source, i = "jump" === e.type;
                d.next(i ? d.getQuestionIdIndex(e.nextQuestionId) : void 0, i ? !n[d.getQuestionIdIndex(e.nextQuestionId)].options.filter(function(t) {
                    return !!t.nextQuestionId;
                }).length : void 0, function(t) {
                    return d.updateOptionContext();
                });
            }
        }), l.addListener({
            next: function(e) {
                var n, i = e.option, r = e.question, o = d.data.source, a = d.answerStack.indexOf(r), s = "jump" === i.type;
                d.setData((n = {}, t(n, "source[" + o.indexOf(r) + "].answer", i.optionId), t(n, "source[" + o.indexOf(r) + "].isAnswerCompletion", s ? !i.nextQuestionId : o[o.length - 1] == r), 
                n)), a > -1 && d.answerStack.splice(a, 1), d.answerStack.push(r), d.freeAnswer = d.freeAnswer.filter(function(t) {
                    return t !== r;
                }), (s ? d.freeAnswer.find(function(t) {
                    return t.questionId == i.nextQuestionId;
                }) : d.freeAnswer.find(function(t) {
                    return t == o(d.data.activeIndex + 1);
                })) || (d.freeAnswer.splice(0).forEach(function(e) {
                    var n;
                    d.tmpCommand.push((n = {}, t(n, "source[" + o.indexOf(e) + "].answer", ""), t(n, "source[" + o.indexOf(e) + "].isAnswerCompletion", !1), 
                    n));
                }), d.batching());
            }
        }), h.merge(l.delay(400), p.delay(200), p.flattenMap(d.loadQuestionImage)).flattenMap(function() {
            return h.fromPromise(g.all([ wx.getDomInfoPr(x + " > .question-body"), wx.getDomInfoPr(x) ])).pardonError();
        }).filter(function(t) {
            return t[0] && t[1];
        }).map(function(t) {
            return t[0].height > t[1].height;
        }).addListener({
            next: function(e) {
                d.setData(t({}, "source[" + d.data.activeIndex + "].needMask", e));
            }
        }), w.addListener({
            next: function() {
                d.showLoading("正在生成报告...");
            },
            error: function(t) {
                return d.showErr(t);
            }
        })), h.merge(w, h.of(d.resultId).filter(function(t) {
            return !!t;
        }).do(function() {
            d.setData({
                isQuestionReady: !0
            }), d.deployReportTask();
        }).flattenMap(function(t) {
            return h.fromPromise(u.fetchResult(t)).pardonError(function(t) {
                a(t), d.hideLoading(), d.setData({
                    isInitFail: !0,
                    isLoading: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        })).addListener({
            next: function(t) {
                var e = t.data;
                e.result.picture = e.result.picture.replace(/\s*/g, ""), d.tmpCommand.push(r({
                    counterAnimation: i(100, 300),
                    isAdvance: !0,
                    smallTitle: e.title.length > 12
                }, s.pick(e, [ "introPicture", "title", "result" ]))), d.batching(), d.exit(), setTimeout(function() {
                    d.enter(), d.hideLoading(), d.initReportTask();
                }, 200), setTimeout(function() {
                    d.setData({
                        isReportReady: !0
                    });
                }, 400);
            }
        }), d.showLoading(d.resultId ? "正在加载报告..." : "正在加载试题...");
    },
    fetchQuestion: function() {
        return wx.fetchDataWithSession(a.question, {
            id: this.id,
            channelId: wx.getChannelId()
        });
    },
    loadQuestionImage: function() {
        var e, n = this;
        return (e = h.create({
            start: function(t) {
                n.data.source.forEach(function(e, n) {
                    e.options;
                    var i = e.picture;
                    i && t.next({
                        url: i,
                        questionIndex: n
                    });
                });
            },
            stop: function() {}
        }).do(function(e) {
            return n.setData(t({}, "source[" + e.questionIndex + "]" + ("number" == typeof e.optionIndex ? ".options[" + e.optionIndex + "]" : "") + ".img", w));
        }).concurrence(function(t) {
            return wx.getImageInfoStream(t.url).map(function(e) {
                return s.extend({}, e, t);
            });
        }, 5)).addListener({
            next: function(e) {
                var i;
                e = s.extend({}, e), i = Math.min(.86 * wx.__system__info__.windowWidth - 70, e.width) / e.width, 
                e.width = Math.ceil(e.width * i), e.height = Math.ceil(e.height * i), n.setData(t({}, "source[" + e.questionIndex + "]" + ("number" == typeof e.optionIndex ? ".options[" + e.optionIndex + "]" : "") + ".img", e));
            }
        }), e;
    },
    submitAnswer: function() {
        return wx.fetchDataWithSession(a.sendAnswer, {
            id: this.id,
            channelId: wx.getChannelId(),
            answers: JSON.stringify(this.answerStack.map(function(t) {
                return r({
                    questionId: t.questionId
                }, s.pick(t.options.find(function(e) {
                    return t.answer == e.optionId;
                }), [ "optionId", "score", "type" ]));
            }))
        }, "post");
    },
    goPrevQuestion: function() {
        var t, e = this, n = this.answerStack.pop(), i = this.data.source;
        n && (this.freeAnswer.push(n), i.indexOf(n) == this.data.activeIndex && this.freeAnswer.push(n = this.answerStack.pop()), 
        t = i.indexOf(n)), this.prev(t, 0 === i.indexOf(n), function(t) {
            return e.updateOptionContext();
        });
    },
    getQuestionIdIndex: function(t) {
        for (var e = this.data.source, n = e.length, i = 0; i < n; i++) if (e[i].questionId === t) return i;
        return -1;
    },
    updateOptionContext: function() {
        this.createOptionAction(this.data.source[this.data.activeIndex]);
    },
    createOptionAction: function(t) {
        for (var e = this, n = 0; e["optionAction" + n]; ) delete e["optionAction" + n], 
        n++;
        t.options.forEach(function(n, i) {
            e["optionAction" + i] = function() {
                e.answer$prod.next({
                    option: n,
                    question: t
                });
            };
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return setTimeout(function() {
            t.drawShareContent ? t.drawShareContent(t.userInfo$) : t.cropShareImage(t.data.introPicture);
        }, 100), o.aldstat.sendEvent("测试结果页点击分享按钮", {
            "测试标题": this.data.name
        }), {
            title: this.data.name,
            imageUrl: this.shareImagePath || this.data.introPicture,
            path: "/pages/evaluation/detail?id=" + this.id + "&channelId=" + wx.getChannelId(),
            success: function() {
                t.data.isReportReady && o.aldstat.sendEvent("成功分享测试结果页", {
                    "测试标题": t.data.name
                });
            }
        };
    }
};

Page(s.mixins(m, f, u, d));