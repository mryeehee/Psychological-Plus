function t(t, n) {
    return "object" !== e.type(t) && (t = {
        msg: t
    }), t.httpConfig = n, t;
}

function n(u, c, i, f) {
    function s(t) {
        E.push(t);
    }
    var a, h = wx.Promise, E = [], T = {
        url: c,
        data: i || {},
        method: u,
        header: {}
    };
    return ((f = e.extend({}, o, f || {})).interceptor ? [ f.interceptor ] : r).forEach(function(t) {
        return t(T, f, s);
    }), a = new h(function(e, r) {
        function o(o) {
            f.retry-- ? setTimeout(function(o) {
                return n(u, c, i, f).then(e, function(n) {
                    return r(t(n, T));
                });
            }, 100) : r(t(o, T));
        }
        wx.request(Object.assign({
            success: function(t) {
                for (var n, r, u = 0; u < E.length; u++) (n = E[u](t, a)) instanceof h && (r = n);
                r ? r.then(e, o) : e(t);
            },
            fail: function(t) {
                o(t);
            }
        }, T));
    });
}

var e = require("core.js"), r = [], o = {
    retry: 0
};

[ "OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT" ].forEach(function(t) {
    n[t.toLowerCase()] = function(e, r, o) {
        return n(t, e, r, o);
    };
}), n.interceptor = r, module.exports = n;