function t(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

function e(t, e) {
    return "string" == typeof t && (t = {
        text: t
    }, e && (t.duration = e)), u.extend({}, l, t);
}

function n(e, n) {
    e = e || r, n = n || o, i && (i.destroy(), i = null), e === r && n === o && (o = r = null), 
    e && n && (e.setData(t({}, n + ".animateClass", "d-b")), d[n] = setTimeout(function() {
        delete d[n], e.setData && e.setData(t({}, n + ".animateClass", ""));
    }, 500));
}

function a(n, a, i) {
    i = e(i), n.setData(t({}, a, u.extend(n.data[a], i)));
}

var i, o, r, u = require("../../utils/core.js"), s = require("../../components/loading-animation/index.js"), l = {
    duration: 3e3
}, d = {};

module.exports = {
    show: function(u, l, c, m) {
        function f() {
            u[l + "Timer"] = c.loading ? -1 : setTimeout(function() {
                n(u, l);
            }, c.duration + 100);
        }
        if (c = e(c, m), u === r && l === o && (d[l] && clearTimeout(d[l]), l && u[l + "Timer"])) return clearTimeout(u[l + "Timer"]), 
        a(u, l, c), void f();
        r && u !== r && n(r, o), c.animateClass = "d-b", o = l, r = u, u.setData(t({}, l, c)), 
        c.loading && (i = new s(function(e) {
            u.setData(t({}, l + ".loadingAnimation", e));
        })).start(), f(), setTimeout(function() {
            u.setData(t({}, l + ".animateClass", "d-b yxl-toast-enter"));
        });
    },
    hide: n,
    changeConfig: a
};