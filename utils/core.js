function t() {
    var n, e, r, i, a, u = Array.prototype.slice.call(arguments), s = u.shift(), f = u.shift();
    for ("boolean" == typeof s ? "boolean" == typeof f ? n = u.shift() : (n = f, f = !1) : (n = s, 
    u.unshift(f), s = f = !1); e = u.shift(); ) for (r in e) e.hasOwnProperty(r) && (i = n[r], 
    a = e[r], s && ("object" === o(a) || "array" === o(a)) && a ? o(i) != o(a) ? t(s, f, n[r] = a instanceof Array ? [] : {}, a) : t(s, f, i, a) : void 0 !== a && (n[r] = f && "function" == typeof i && "function" == typeof a ? function(t, n) {
        return function() {
            return t.apply(this, arguments), n.apply(this, arguments);
        };
    }(i, a) : a));
    return n;
}

function n(t, n, o) {
    var e;
    if ("number" == typeof t.length) for (e = 0; e < t.length && !1 !== n(t[e], e, t); e++) ; else if (t && "object" === (void 0 === t ? "undefined" : i(t))) for (e in t) if ((o || t.hasOwnProperty(e)) && !1 === n(t[e], e, t)) break;
}

function o(t) {
    return null == t ? String(t) : a[u.call(t)] || "object";
}

function e(t, o) {
    var e = {};
    return n(o, function(n) {
        e[n] = t[n];
    }), e;
}

function r(t, n) {
    getApp().aldstat.sendEvent(t, n), wx.reportAnalytics && wx.reportAnalytics(t, n);
}

var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, a = (require("apiUrl.js"), {}), u = a.toString;

n("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, n) {
    a["[object " + t + "]"] = t.toLowerCase();
});

var s = {
    4: {
        unit: "k",
        start: 4
    },
    5: "w"
};

module.exports = {
    extend: t,
    filter: function(t, o) {
        var e = [];
        return n(t, function(t, n) {
            o(t, n) && e.push(t);
        }), e;
    },
    remove: function(t, o) {
        n(t, function(n, e) {
            if (n === o) return t.splice(e, 1), !1;
        });
    },
    each: n,
    map: function(t, o) {
        var e = [], r = 0;
        return n(t, function(n, i) {
            e[r++] = o(n, i, t);
        }), e;
    },
    omit: function(o, e) {
        var r = t({}, o);
        return n(e, function(t) {
            delete r[t];
        }), r;
    },
    pick: e,
    invoke: function(t) {
        wx[t] ? wx[t].apply(wx, Array.prototype.slice.call(arguments, 1)) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    },
    type: o,
    likeArray: function(t) {
        return "object" == (void 0 === t ? "undefined" : i(t)) && "number" == typeof t.length;
    },
    isFunction: function(t) {
        return "function" == o(t);
    },
    isPlainObject: function(t) {
        return "object" == o(t);
    },
    retry: function(t) {
        var n = wx.Promise;
        return function o(e) {
            return new n(function(n, r) {
                t().then(n, function(t) {
                    e-- ? o(e).then(n, r) : r(t);
                });
            });
        };
    },
    formatCount: function(t, n) {
        n = n || s;
        var o, e, r, a, u = Object.keys(n);
        o = ((t = Math.floor(+t)) + "").length;
        for (var f = u.length - 1; f >= 0; f--) if (e = u[f], r = n[e], e = "object" === (void 0 === r ? "undefined" : i(r)) ? r.start : e, 
        o >= e) {
            a = u[f];
            break;
        }
        return a ? +(t / Math.pow(10, a - 1)).toFixed(1) + (n[a].unit || n[a]) : t;
    },
    scale: function(t, n, o, e) {
        var r = Math.max(o / t, e / n);
        return {
            width: Math.ceil(t * r),
            height: Math.ceil(n * r)
        };
    },
    json2Form: function(t) {
        var n = [];
        for (var o in t) n.push(encodeURIComponent(o) + "=" + encodeURIComponent(t[o]));
        return n.join("&");
    },
    mixins: function() {
        return t.apply(null, [ !0, !0 ].concat(Array.prototype.slice.call(arguments)));
    },
    showErr: function(n, o, a) {
        var u, s;
        if (n) {
            (u = t({}, n = "object" === (void 0 === n ? "undefined" : i(n)) ? n : {
                msg: n
            }, wx.__system__info__)).msg = u.msg || n.message || u.errMsg, u.sdk = u.SDKVersion, 
            (s = n.httpConfig) ? (u.http_url = s.url, u.http_params = JSON.stringify(s.data)) : (u.http_url = "", 
            u.http_params = "");
            try {
                var f = getCurrentPages();
                u.route = f[f.length - 1].route;
            } catch (t) {}
            u = e(u, [ "msg", "sdk", "version", "brand", "http_params", "http_url", "model", "system", "route" ]), 
            console.warn(u), wx.reportSwitch && u.msg && r("js_err", u), a && wx.toastAPI.show(this, "toastConfig", "string" == typeof n ? n : n.msg || n.errMsg || n.message, o || 5e3);
        }
    },
    reportLog: r,
    showToast: function(t, n) {
        t && wx.toastAPI.show(this, "toastConfig", t, n || 5e3);
    },
    showLoading: function(t) {
        wx.toastAPI.show(this, "toastLoadingConfig", {
            loading: !0,
            text: t
        });
    },
    hideLoading: function() {
        wx.toastAPI.hide(this, "toastLoadingConfig");
    }
};