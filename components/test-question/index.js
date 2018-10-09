function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function e(t) {
    return wx.createAnimation({
        duration: void 0 === t ? 300 : t
    });
}

function a(e) {
    return function(a, n) {
        i(this.cardStack, a) && this.tmpCommand.push(t({}, "animateData" + this.cardStack[a], e(n)));
    };
}

function i(t, e) {
    if (!(e < 0 || e >= t.length)) return t[e];
}

var n = wx.getSystemInfoSync(), r = require("../../utils/core.js"), s = Math.floor(86 * n.windowWidth / 100), c = "no";

module.exports = {
    data: {
        animateData1: {},
        animateData2: {},
        animateData3: {},
        animateData4: {},
        pageDataIndex: [ c, c, c, c ]
    },
    onLoad: function() {},
    cardStack: [ 1, 2, 3, 4 ],
    activeCard: -1,
    activeCardIndex: -1,
    isAnimating: !1,
    tmpCommand: [],
    initCard: function() {
        var t, e = this.data.source.length, a = this.data.activeIndex;
        this.cardStack.sort(function(t, e) {
            return t - e;
        }), this.setActiveCard(0 == a ? 1 : a >= e - 1 ? 4 : 2), this.oriCardStack = this.cardStack.slice(0), 
        t = this.activeCardIndex, this.updatePageDataIndex(), this.setLeftFar(t - 3, !0), 
        this.setLeftFar(t - 2, !0), this[e > 1 ? "setLeft" : "setLeftFar"](t - 1, !0), this.setCenter(t, !0), 
        this[e > 1 ? "setRight" : "setRightFar"](t + 1, !0), this.setRightFar(t + 2, !0), 
        this.setRightFar(t + 3, !0), this.execSetData();
    },
    fixOrder: function(t) {
        var e = this.oriCardStack, a = this.cardStack, i = [];
        return e.forEach(function(e) {
            i.push(t[a.indexOf(e)]);
        }), i;
    },
    getCardIndex: function(t) {
        return this.cardStack.indexOf(t);
    },
    setActiveCard: function(t) {
        this.activeCard = t, this.activeCardIndex = this.getCardIndex(t);
    },
    execSetData: function() {
        this.tmpCommand.length && this.setData(r.extend.apply(null, this.tmpCommand.splice(0)));
    },
    computePageDataIndexWithStack: function() {
        var t = this, e = this.cardStack, a = this.activeCard, i = e.map(function(e, a) {
            return t.data.activeIndex - t.activeCardIndex + a;
        });
        return e.forEach(function(t, e) {
            t !== a && i.splice(e, 1, c);
        }), i;
    },
    updatePageDataIndex: function() {
        this.tmpCommand.push({
            pageDataIndex: this.fixOrder(this.computePageDataIndexWithStack())
        });
    },
    renderNextScreen: function(t, e) {
        var a = this.computePageDataIndexWithStack();
        a[this.activeCardIndex + (e ? -1 : 1)] = t, this.tmpCommand.push({
            pageDataIndex: this.fixOrder(a)
        });
    },
    setActiveIndex: function(t) {
        this.tmpCommand.push({
            activeIndex: t
        });
    },
    setCenter: a(function() {
        var t = e();
        return t.translateX(0).scale(1).step(), t.export();
    }),
    setLeftFar: a(function(t) {
        var a = e(t ? 0 : 300);
        return a.translateX(-2 * s).scale(.9).step(), a.export();
    }),
    setRightFar: a(function(t) {
        var a = e(t ? 0 : 300);
        return a.translateX(2 * s).scale(.9).step(), a.export();
    }),
    setLeft: a(function(t) {
        var a = e(t ? 0 : 300);
        return a.translateX(-s).scale(.9).step(), a.export();
    }),
    setRight: a(function(t) {
        var a = e(t ? 0 : 300);
        return a.translateX(s).scale(.9).step(), a.export();
    }),
    next: function(t, e, a) {
        var i = this, n = this.cardStack, r = this.activeCardIndex, s = this.data.activeIndex, c = this.data.source.length, d = "boolean" == typeof e, h = "number" == typeof t, o = h ? t : s + 1;
        e = d ? e : s >= c - 2, i.isAnimating || o === s || s >= c - 1 && !h || (i.isAnimating = !0, 
        i.setRightFar(r - 2, !0), i.setRightFar(r + 2, !0), i.renderNextScreen(o), i.execSetData(), 
        setTimeout(function() {
            i.setLeftFar(r - 1), i.setLeft(r), i.setCenter(r + 1), e || (i.setRight(r - 2), 
            i.setRight(r + 2)), i.setActiveIndex(o), i.execSetData(), setTimeout(function() {
                r > 0 ? (n.push(n.shift()), i.setActiveCard(i.cardStack[r])) : i.setActiveCard(i.cardStack[r + 1]), 
                i.updatePageDataIndex(), i.execSetData(), a && a(), i.isAnimating = !1;
            }, 300);
        }, 50));
    },
    prev: function(t, e, a) {
        var i = this, n = this.cardStack, r = this.activeCardIndex, s = this.data.activeIndex, c = this.data.source.length, d = "boolean" == typeof e, h = "number" == typeof t, o = h ? t : s - 1;
        e = d ? e : s <= 1, i.isAnimating || o === s || s <= 0 && !h || (i.isAnimating = !0, 
        i.setLeftFar(r - 2, !0), i.setLeftFar(r + 2, !0), i.renderNextScreen(o, !0), i.execSetData(), 
        setTimeout(function() {
            i.setCenter(r - 1), i.setRight(r), i.setRightFar(r + 1), e || (i.setLeft(r + 2), 
            i.setLeft(r - 2)), i.setActiveIndex(o), i.execSetData(), setTimeout(function() {
                r < c - 1 && r < 2 ? (n.unshift(n.pop()), i.setActiveCard(i.cardStack[r])) : i.setActiveCard(i.cardStack[r - 1]), 
                i.updatePageDataIndex(), i.execSetData(), a && a(), i.isAnimating = !1;
            }, 300);
        }, 50));
    },
    exit: function() {
        var t = this.activeCardIndex;
        this.setLeftFar(t - 1), this.setLeftFar(t), this.setRightFar(t + 1), this.execSetData();
    }
};