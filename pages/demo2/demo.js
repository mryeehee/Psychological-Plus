function t(t, n, e) {
    return n in t ? Object.defineProperty(t, n, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[n] = e, t;
}

var n = Object.assign || function(t) {
    for (var n = 1; n < arguments.length; n++) {
        var e = arguments[n];
        for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    }
    return t;
}, e = getApp(), i = require("../../utils/apiUrl.js"), o = require("../../utils/core.js"), r = require("../../utils/page-mixins.js"), a = require("../../components/test-question/index.js"), s = wx.xstream.Stream, u = "#active-question > .slider-view-body > .question-item > .question-body-wrap", d = {
    width: 500,
    height: 280
}, c = wx.Promise, f = {
    data: {
        indexTexts: function() {
            for (var t = [], n = 0; n < 20; n++) t.push(String.fromCharCode(65 + n));
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
        shareSize: e.globalData.shareSize
    },
    answerStack: [],
    freeAnswer: [],
    onLoad: function(n) {
        var i = this;
        i.id = 209;
        var o, r;
        o = s.of(1).flattenMap(function(t) {
            return s.fromPromise(i.fetchQuestion());
        }).cache(), r = s.create({
            start: function(t) {
                i.answer$prod = t;
            },
            stop: function() {
                i.answer$prod = null;
            }
        }).filter(function(t) {
            return !i.data.isSending;
        }), s.fromEvent("submit", this).filter(function(t) {
            return !i.data.isSending;
        }).do(function(t) {
            i.setData({
                isSending: !0
            }), i.showLoading("正在提交..."), e.aldstat.sendEvent("提交答案", {
                "测试标题": i.data.name
            });
        }).flattenMap(function(t) {
            return s.fromPromise(i.submitAnswer()).pardonError(function(t) {
                i.showErr(t, 3e3, !0), i.setData({
                    isSending: !1
                });
            });
        }), s.fromEvent("restartPage", i).filter(function(t) {
            return !i.data.isLoading;
        }).startWith(0).do(function(t) {
            return i.setData({
                isLoading: !0
            });
        }).flattenMap(function(t) {
            return o.pardonError(function(t) {
                i.showErr(t, 3e3, !0), i.hideLoading(), i.setData({
                    isInitFail: !0,
                    isLoading: !1
                });
            });
        }).filter(function(t) {
            return !!t;
        }).addListener({
            next: function(t) {
                var n = t.data;
                n.questions[n.questions.length - 1].isLastQuestion = !0, n.questions.forEach(function(t, n) {
                    t.index = n + 1;
                }), i.hideLoading(), i.setData({
                    isInit: !0,
                    isInitFail: !1,
                    isQuestionReady: !0,
                    source: n.questions,
                    name: n.title,
                    introPicture: n.introPicture
                }), e.aldstat.sendEvent("开始测试", {
                    "测试标题": n.title
                }), wx.setNavigationBarTitle && wx.setNavigationBarTitle({
                    title: n.title
                }), i.initCard(), setTimeout(function() {
                    return i.updateOptionContext();
                }, 100);
            },
            error: function(t) {
                return i.showErr(t);
            }
        }), r.filter(function(t) {
            var n = t.option;
            return "jump" !== n.type || !!n.nextQuestionId;
        }).addListener({
            next: function(t) {
                var n = t.option, e = "jump" === n.type;
                i.next(e ? i.getQuestionIdIndex(n.nextQuestionId) : void 0, e ? i.getQuestionIdIndex(n.nextQuestionId) == i.data.source.length - 1 : void 0, function(t) {
                    return i.updateOptionContext();
                });
            }
        }), r.addListener({
            next: function(n) {
                var e, o = n.option, r = n.question, a = i.data.source, s = i.answerStack.indexOf(r), u = "jump" === o.type;
                i.setData((e = {}, t(e, "source[" + a.indexOf(r) + "].answer", o.optionId), t(e, "source[" + a.indexOf(r) + "].isAnswerCompletion", u ? !o.nextQuestionId : a[a.length - 1] == r), 
                e)), s > -1 && i.answerStack.splice(s, 1), i.answerStack.push(r), i.freeAnswer = i.freeAnswer.filter(function(t) {
                    return t !== r;
                }), (u ? i.freeAnswer.find(function(t) {
                    return t.questionId == o.nextQuestionId;
                }) : i.freeAnswer.find(function(t) {
                    return t == a(i.data.activeIndex + 1);
                })) || (i.freeAnswer.splice(0).forEach(function(n) {
                    var e;
                    i.tmpCommand.push((e = {}, t(e, "source[" + a.indexOf(n) + "].answer", ""), t(e, "source[" + a.indexOf(n) + "].isAnswerCompletion", !1), 
                    e));
                }), i.batching());
            }
        }), s.merge(r.delay(400), o, o.flattenMap(i.loadQuestionImage)).flattenMap(function() {
            return s.fromPromise(c.all([ wx.getDomInfoPr(u + " > .question-body"), wx.getDomInfoPr(u) ])).pardonError();
        }).filter(function(t) {
            return t[0] && t[1];
        }).map(function(t) {
            return t[0].height > t[1].height;
        }).addListener({
            next: function(n) {
                i.setData(t({}, "source[" + i.data.activeIndex + "].needMask", n));
            }
        }), i.showLoading("正在加载试题...");
    },
    fetchQuestion: function() {
        return wx.fetchDataWithSession(i.question, {
            id: this.id,
            channelId: wx.getChannelId()
        });
    },
    loadQuestionImage: function() {
        var n, e = this;
        return (n = s.create({
            start: function(t) {
                e.data.source.forEach(function(n, e) {
                    n.options;
                    var i = n.picture;
                    i && t.next({
                        url: i,
                        questionIndex: e
                    });
                });
            },
            stop: function() {}
        }).do(function(n) {
            return e.setData(t({}, "source[" + n.questionIndex + "]" + ("number" == typeof n.optionIndex ? ".options[" + n.optionIndex + "]" : "") + ".img", d));
        }).concurrence(function(t) {
            return wx.getImageInfoStream(t.url).map(function(n) {
                return o.extend({}, n, t);
            });
        }, 5)).addListener({
            next: function(n) {
                var i;
                n = o.extend({}, n), i = Math.min(.86 * wx.__system__info__.windowWidth - 70, n.width) / n.width, 
                n.width = Math.ceil(n.width * i), n.height = Math.ceil(n.height * i), e.setData(t({}, "source[" + n.questionIndex + "]" + ("number" == typeof n.optionIndex ? ".options[" + n.optionIndex + "]" : "") + ".img", n));
            }
        }), n;
    },
    submitAnswer: function() {
        return wx.fetchDataWithSession(i.sendAnswer, {
            id: this.id,
            channelId: wx.getChannelId(),
            answers: JSON.stringify(this.answerStack.map(function(t) {
                return n({
                    questionId: t.questionId
                }, o.pick(t.options.find(function(n) {
                    return t.answer == n.optionId;
                }), [ "optionId", "score", "type" ]));
            }))
        }, "post");
    },
    goPrevQuestion: function() {
        var t, n = this, e = this.answerStack.pop(), i = this.data.source;
        e && (this.freeAnswer.push(e), i.indexOf(e) == this.data.activeIndex && this.freeAnswer.push(e = this.answerStack.pop()), 
        t = i.indexOf(e)), this.prev(t, 0 === i.indexOf(e), function(t) {
            return n.updateOptionContext();
        });
    },
    getQuestionIdIndex: function(t) {
        for (var n = this.data.source, e = n.length, i = 0; i < e; i++) if (n[i].questionId === t) return i;
        return -1;
    },
    updateOptionContext: function() {
        this.createOptionAction(this.data.source[this.data.activeIndex]);
    },
    createOptionAction: function(t) {
        for (var n = this, e = 0; n["optionAction" + e]; ) delete n["optionAction" + e], 
        e++;
        t.options.forEach(function(e, i) {
            n["optionAction" + i] = function() {
                n.answer$prod.next({
                    option: e,
                    question: t
                });
            };
        });
    }
};

Page(o.mixins(f, a, r));