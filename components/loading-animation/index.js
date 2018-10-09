function t(t, n, e) {
    return n in t ? Object.defineProperty(t, n, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[n] = e, t;
}

function n(t, n) {
    if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function");
}

function e() {
    return wx.createAnimation({
        duration: 700
    });
}

var i = function() {
    function t(t, n) {
        for (var e = 0; e < n.length; e++) {
            var i = n[e];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
            Object.defineProperty(t, i.key, i);
        }
    }
    return function(n, e, i) {
        return e && t(n.prototype, e), i && t(n, i), n;
    };
}(), a = function() {
    function a(e, i) {
        n(this, a), this.context = e, this.bindCallback = "string" == typeof i ? function(n) {
            e.setData(t({}, i, n));
        } : e, this.animate_timer = -1;
    }
    return i(a, [ {
        key: "start",
        value: function() {
            function t(e, o) {
                r.animate_timer = setTimeout(function() {
                    n.scale(e > 0 ? 0 : 1).step(), i.scale(e > 0 ? 1 : 0).step(), a({
                        animationDot1: n.export(),
                        animationDot2: i.export()
                    }), t(-1 * e, 700);
                }, o);
            }
            var n, i, a = this.bindCallback, r = this;
            n = e(), i = e(), t(-1, 100);
        }
    }, {
        key: "destroy",
        value: function() {
            clearTimeout(this.animate_timer), this.bindCallback(this.context = null);
        }
    } ]), a;
}();

module.exports = a;