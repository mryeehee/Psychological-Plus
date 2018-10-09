var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function(e, n) {
    "object" == ("undefined" == typeof exports ? "undefined" : t(exports)) && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : e.ES6Promise = n();
}(void 0, function() {
    function e(e) {
        var n = void 0 === e ? "undefined" : t(e);
        return null !== e && ("object" === n || "function" === n);
    }
    function n(t) {
        return "function" == typeof t;
    }
    function r() {
        return void 0 !== D ? function() {
            D(i);
        } : o();
    }
    function o() {
        var t = setTimeout;
        return function() {
            return t(i, 1);
        };
    }
    function i() {
        for (var t = 0; t < F; t += 2) (0, G[t])(G[t + 1]), G[t] = void 0, G[t + 1] = void 0;
        F = 0;
    }
    function s(t, e) {
        var n = arguments, r = this, o = new this.constructor(c);
        void 0 === o[I] && x(o);
        var i = r._state;
        return i ? function() {
            var t = n[i - 1];
            L(function() {
                return j(i, o, t, r._result);
            });
        }() : w(r, o, t, e), o;
    }
    function u(e) {
        var n = this;
        if (e && "object" == (void 0 === e ? "undefined" : t(e)) && e.constructor === n) return e;
        var r = new n(c);
        return _(r, e), r;
    }
    function c() {}
    function f() {
        return new TypeError("You cannot resolve a promise with itself");
    }
    function a() {
        return new TypeError("A promises callback cannot return that same promise.");
    }
    function l(t) {
        try {
            return t.then;
        } catch (t) {
            return V.error = t, V;
        }
    }
    function h(t, e, n, r) {
        try {
            t.call(e, n, r);
        } catch (t) {
            return t;
        }
    }
    function d(t, e, n) {
        L(function(t) {
            var r = !1, o = h(n, e, function(n) {
                r || (r = !0, e !== n ? _(t, n) : m(t, n));
            }, function(e) {
                r || (r = !0, b(t, e));
            }, "Settle: " + (t._label || " unknown promise"));
            !r && o && (r = !0, b(t, o));
        }, t);
    }
    function p(t, e) {
        e._state === Q ? m(t, e._result) : e._state === R ? b(t, e._result) : w(e, void 0, function(e) {
            return _(t, e);
        }, function(e) {
            return b(t, e);
        });
    }
    function v(t, e, r) {
        e.constructor === t.constructor && r === s && e.constructor.resolve === u ? p(t, e) : r === V ? (b(t, V.error), 
        V.error = null) : void 0 === r ? m(t, e) : n(r) ? d(t, e, r) : m(t, e);
    }
    function _(t, n) {
        t === n ? b(t, f()) : e(n) ? v(t, n, l(n)) : m(t, n);
    }
    function y(t) {
        t._onerror && t._onerror(t._result), g(t);
    }
    function m(t, e) {
        t._state === J && (t._result = e, t._state = Q, 0 !== t._subscribers.length && L(g, t));
    }
    function b(t, e) {
        t._state === J && (t._state = R, t._result = e, L(y, t));
    }
    function w(t, e, n, r) {
        var o = t._subscribers, i = o.length;
        t._onerror = null, o[i] = e, o[i + Q] = n, o[i + R] = r, 0 === i && t._state && L(g, t);
    }
    function g(t) {
        var e = t._subscribers, n = t._state;
        if (0 !== e.length) {
            for (var r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3) r = e[s], 
            o = e[s + n], r ? j(n, r, o, i) : o(i);
            t._subscribers.length = 0;
        }
    }
    function A() {
        this.error = null;
    }
    function S(t, e) {
        try {
            return t(e);
        } catch (t) {
            return X.error = t, X;
        }
    }
    function j(t, e, r, o) {
        var i = n(r), s = void 0, u = void 0, c = void 0, f = void 0;
        if (i) {
            if ((s = S(r, o)) === X ? (f = !0, u = s.error, s.error = null) : c = !0, e === s) return void b(e, a());
        } else s = o, c = !0;
        e._state !== J || (i && c ? _(e, s) : f ? b(e, u) : t === Q ? m(e, s) : t === R && b(e, s));
    }
    function E(t, e) {
        try {
            e(function(e) {
                _(t, e);
            }, function(e) {
                b(t, e);
            });
        } catch (e) {
            b(t, e);
        }
    }
    function T() {
        return Z++;
    }
    function x(t) {
        t[I] = Z++, t._state = void 0, t._result = void 0, t._subscribers = [];
    }
    function M(t, e) {
        this._instanceConstructor = t, this.promise = new t(c), this.promise[I] || x(this.promise), 
        q(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 
        0 === this.length ? m(this.promise, this._result) : (this.length = this.length || 0, 
        this._enumerate(e), 0 === this._remaining && m(this.promise, this._result))) : b(this.promise, P());
    }
    function P() {
        return new Error("Array Methods must be provided an Array");
    }
    function C() {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
    }
    function O() {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }
    function k(t) {
        this[I] = T(), this._result = this._state = void 0, this._subscribers = [], c !== t && ("function" != typeof t && C(), 
        this instanceof k ? E(this, t) : O());
    }
    var Y = void 0, q = Y = Array.isArray ? Array.isArray : function(t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    }, F = 0, D = void 0, K = void 0, L = function(t, e) {
        G[F] = t, G[F + 1] = e, 2 === (F += 2) && (K ? K(i) : H());
    }, N = "undefined" != typeof window ? window : void 0, U = N || {}, W = U.MutationObserver || U.WebKitMutationObserver, z = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process), B = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, G = new Array(1e3), H = void 0;
    H = z ? function() {
        return process.nextTick(i);
    } : W ? function() {
        var t = 0, e = new W(i), n = document.createTextNode("");
        return e.observe(n, {
            characterData: !0
        }), function() {
            n.data = t = ++t % 2;
        };
    }() : B ? function() {
        var t = new MessageChannel();
        return t.port1.onmessage = i, function() {
            return t.port2.postMessage(0);
        };
    }() : void 0 === N && "function" == typeof require ? function() {
        try {
            var t = require("vertx");
            return D = t.runOnLoop || t.runOnContext, r();
        } catch (t) {
            return o();
        }
    }() : o();
    var I = Math.random().toString(36).substring(16), J = void 0, Q = 1, R = 2, V = new A(), X = new A(), Z = 0;
    return M.prototype._enumerate = function(t) {
        for (var e = 0; this._state === J && e < t.length; e++) this._eachEntry(t[e], e);
    }, M.prototype._eachEntry = function(t, e) {
        var n = this._instanceConstructor, r = n.resolve;
        if (r === u) {
            var o = l(t);
            if (o === s && t._state !== J) this._settledAt(t._state, e, t._result); else if ("function" != typeof o) this._remaining--, 
            this._result[e] = t; else if (n === k) {
                var i = new n(c);
                v(i, t, o), this._willSettleAt(i, e);
            } else this._willSettleAt(new n(function(e) {
                return e(t);
            }), e);
        } else this._willSettleAt(r(t), e);
    }, M.prototype._settledAt = function(t, e, n) {
        var r = this.promise;
        r._state === J && (this._remaining--, t === R ? b(r, n) : this._result[e] = n), 
        0 === this._remaining && m(r, this._result);
    }, M.prototype._willSettleAt = function(t, e) {
        var n = this;
        w(t, void 0, function(t) {
            return n._settledAt(Q, e, t);
        }, function(t) {
            return n._settledAt(R, e, t);
        });
    }, k.all = function(t) {
        return new M(this, t).promise;
    }, k.race = function(t) {
        var e = this;
        return new e(q(t) ? function(n, r) {
            for (var o = t.length, i = 0; i < o; i++) e.resolve(t[i]).then(n, r);
        } : function(t, e) {
            return e(new TypeError("You must pass an array to race."));
        });
    }, k.resolve = u, k.reject = function(t) {
        var e = new this(c);
        return b(e, t), e;
    }, k._setScheduler = function(t) {
        K = t;
    }, k._setAsap = function(t) {
        L = t;
    }, k._asap = L, k.prototype = {
        constructor: k,
        then: s,
        catch: function(t) {
            return this.then(null, t);
        }
    }, k.polyfill = function() {
        var t = void 0;
        if ("undefined" != typeof global) t = global; else if ("undefined" != typeof self) t = self; else try {
            t = Function("return this")();
        } catch (t) {
            throw new Error("polyfill failed because global object is unavailable in this environment");
        }
        var e = t.Promise;
        if (e) {
            var n = null;
            try {
                n = Object.prototype.toString.call(e.resolve());
            } catch (t) {}
            if ("[object Promise]" === n && !e.cast) return;
        }
        t.Promise = k;
    }, k.Promise = k, k;
});