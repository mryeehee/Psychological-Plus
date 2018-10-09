var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function(o) {
    if ("object" === ("undefined" == typeof exports ? "undefined" : t(exports)) && "undefined" != typeof module) module.exports = o(); else if ("function" == typeof define && define.amd) define([], o); else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).xstream = o();
    }
}(function() {
    return function t(o, i, n) {
        function e(s, u) {
            if (!i[s]) {
                if (!o[s]) {
                    var h = "function" == typeof require && require;
                    if (!u && h) return h(s, !0);
                    if (r) return r(s, !0);
                    var p = new Error("Cannot find module '" + s + "'");
                    throw p.code = "MODULE_NOT_FOUND", p;
                }
                var f = i[s] = {
                    exports: {}
                };
                o[s][0].call(f.exports, function(t) {
                    var i = o[s][1][t];
                    return e(i || t);
                }, f, f.exports, t, o, i, n);
            }
            return i[s].exports;
        }
        for (var r = "function" == typeof require && require, s = 0; s < n.length; s++) e(n[s]);
        return e;
    }({
        1: [ function(t, o, i) {
            function n() {}
            function e(t) {
                for (var o = t.length, i = Array(o), n = 0; n < o; ++n) i[n] = t[n];
                return i;
            }
            function r(t, o) {
                return function(i) {
                    return t(i) && o(i);
                };
            }
            function s(t, o, i) {
                try {
                    return t.f(o);
                } catch (t) {
                    return i._e(t), f;
                }
            }
            function u(t) {
                t._start = function(t) {
                    t.next = t._n, t.error = t._e, t.complete = t._c, this.start(t);
                }, t._stop = t.stop;
            }
            var h = this && this.__extends || function() {
                var t = Object.setPrototypeOf || {
                    __proto__: []
                } instanceof Array && function(t, o) {
                    t.__proto__ = o;
                } || function(t, o) {
                    for (var i in o) o.hasOwnProperty(i) && (t[i] = o[i]);
                };
                return function(o, i) {
                    function n() {
                        this.constructor = o;
                    }
                    t(o, i), o.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, 
                    new n());
                };
            }();
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var p = t("symbol-observable"), f = {};
            i.NO = f;
            var c = {
                _n: n,
                _e: n,
                _c: n
            };
            i.NO_IL = c;
            var _ = function() {
                function t(t, o) {
                    this._stream = t, this._listener = o;
                }
                return t.prototype.unsubscribe = function() {
                    this._stream.removeListener(this._listener);
                }, t;
            }(), a = function() {
                function t(t) {
                    this._listener = t;
                }
                return t.prototype.next = function(t) {
                    this._listener._n(t);
                }, t.prototype.error = function(t) {
                    this._listener._e(t);
                }, t.prototype.complete = function() {
                    this._listener._c();
                }, t;
            }(), y = function() {
                function t(t) {
                    this.type = "fromObservable", this.ins = t, this.active = !1;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.active = !0, this._sub = this.ins.subscribe(new a(t)), this.active || this._sub.unsubscribe();
                }, t.prototype._stop = function() {
                    this._sub && this._sub.unsubscribe(), this.active = !1;
                }, t;
            }(), l = function() {
                function t(t) {
                    this.type = "merge", this.insArr = t, this.out = f, this.ac = 0;
                }
                return t.prototype._start = function(t) {
                    this.out = t;
                    var o = this.insArr, i = o.length;
                    this.ac = i;
                    for (var n = 0; n < i; n++) o[n]._add(this);
                }, t.prototype._stop = function() {
                    for (var t = this.insArr, o = t.length, i = 0; i < o; i++) t[i]._remove(this);
                    this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    o !== f && o._n(t);
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    if (--this.ac <= 0) {
                        var t = this.out;
                        if (t === f) return;
                        t._c();
                    }
                }, t;
            }(), d = function() {
                function t(t, o, i) {
                    this.i = t, this.out = o, this.p = i, i.ils.push(this);
                }
                return t.prototype._n = function(t) {
                    var o = this.p, i = this.out;
                    if (i !== f && o.up(t, this.i)) {
                        for (var n = o.vals, e = n.length, r = Array(e), s = 0; s < e; ++s) r[s] = n[s];
                        i._n(r);
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.p;
                    t.out !== f && 0 == --t.Nc && t.out._c();
                }, t;
            }(), v = function() {
                function t(t) {
                    this.type = "combine", this.insArr = t, this.out = f, this.ils = [], this.Nc = this.Nn = 0, 
                    this.vals = [];
                }
                return t.prototype.up = function(t, o) {
                    var i = this.vals[o], n = this.Nn ? i === f ? --this.Nn : this.Nn : 0;
                    return this.vals[o] = t, 0 === n;
                }, t.prototype._start = function(t) {
                    this.out = t;
                    var o = this.insArr, i = this.Nc = this.Nn = o.length, n = this.vals = new Array(i);
                    if (0 === i) t._n([]), t._c(); else for (var e = 0; e < i; e++) n[e] = f, o[e]._add(new d(e, t, this));
                }, t.prototype._stop = function() {
                    for (var t = this.insArr, o = t.length, i = this.ils, n = 0; n < o; n++) t[n]._remove(i[n]);
                    this.out = f, this.ils = [], this.vals = [];
                }, t;
            }(), m = function() {
                function t(t) {
                    this.type = "fromArray", this.a = t;
                }
                return t.prototype._start = function(t) {
                    for (var o = this.a, i = 0, n = o.length; i < n; i++) t._n(o[i]);
                    t._c();
                }, t.prototype._stop = function() {}, t;
            }(), w = function() {
                function t(t) {
                    this.type = "fromPromise", this.on = !1, this.p = t;
                }
                return t.prototype._start = function(t) {
                    var o = this;
                    this.on = !0, this.p.then(function(i) {
                        o.on && (t._n(i), t._c());
                    }, function(o) {
                        t._e(o);
                    }).then(n, function(t) {
                        setTimeout(function() {
                            throw t;
                        });
                    });
                }, t.prototype._stop = function() {
                    this.on = !1;
                }, t;
            }(), b = function() {
                function t(t) {
                    this.type = "periodic", this.period = t, this.intervalID = -1, this.i = 0;
                }
                return t.prototype._start = function(t) {
                    var o = this;
                    this.intervalID = setInterval(function() {
                        t._n(o.i++);
                    }, this.period);
                }, t.prototype._stop = function() {
                    -1 !== this.intervalID && clearInterval(this.intervalID), this.intervalID = -1, 
                    this.i = 0;
                }, t;
            }(), g = function() {
                function t(t, o) {
                    this.type = "debug", this.ins = t, this.out = f, this.s = n, this.l = "", "string" == typeof o ? this.l = o : "function" == typeof o && (this.s = o);
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = this.s, e = this.l;
                        if (i !== n) try {
                            i(t);
                        } catch (t) {
                            o._e(t);
                        } else e ? console.log(e + ":", t) : console.log(t);
                        o._n(t);
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), x = function() {
                function t(t, o) {
                    this.type = "drop", this.ins = o, this.out = f, this.max = t, this.dropped = 0;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.dropped = 0, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    o !== f && this.dropped++ >= this.max && o._n(t);
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), N = function() {
                function t(t, o) {
                    this.out = t, this.op = o;
                }
                return t.prototype._n = function() {
                    this.op.end();
                }, t.prototype._e = function(t) {
                    this.out._e(t);
                }, t.prototype._c = function() {
                    this.op.end();
                }, t;
            }(), A = function() {
                function t(t, o) {
                    this.type = "endWhen", this.ins = o, this.out = f, this.o = t, this.oil = c;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.o._add(this.oil = new N(t, this)), this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.o._remove(this.oil), this.out = f, this.oil = c;
                }, t.prototype.end = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    o !== f && o._n(t);
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    this.end();
                }, t;
            }(), O = function() {
                function t(t, o) {
                    this.type = "filter", this.ins = o, this.out = f, this.f = t;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = s(this, t, o);
                        i !== f && i && o._n(t);
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), D = function() {
                function t(t, o) {
                    this.out = t, this.op = o;
                }
                return t.prototype._n = function(t) {
                    this.out._n(t);
                }, t.prototype._e = function(t) {
                    this.out._e(t);
                }, t.prototype._c = function() {
                    this.op.inner = f, this.op.less();
                }, t;
            }(), I = function() {
                function t(t) {
                    this.type = "flatten", this.ins = t, this.out = f, this.open = !0, this.inner = f, 
                    this.il = c;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.open = !0, this.inner = f, this.il = c, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.inner !== f && this.inner._remove(this.il), this.out = f, 
                    this.open = !0, this.inner = f, this.il = c;
                }, t.prototype.less = function() {
                    var t = this.out;
                    t !== f && (this.open || this.inner !== f || t._c());
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = this, n = i.inner, e = i.il;
                        n !== f && e !== c && n._remove(e), (this.inner = t)._add(this.il = new D(o, this));
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    this.open = !1, this.less();
                }, t;
            }(), S = function() {
                function t(t, o, i) {
                    var n = this;
                    this.type = "fold", this.ins = i, this.out = f, this.f = function(o) {
                        return t(n.acc, o);
                    }, this.acc = this.seed = o;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.acc = this.seed, t._n(this.acc), this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f, this.acc = this.seed;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = s(this, t, o);
                        i !== f && o._n(this.acc = i);
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), k = function() {
                function t(t) {
                    this.type = "last", this.ins = t, this.out = f, this.has = !1, this.val = f;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.has = !1, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f, this.val = f;
                }, t.prototype._n = function(t) {
                    this.has = !0, this.val = t;
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && (this.has ? (t._n(this.val), t._c()) : t._e(new Error("last() failed because input stream completed")));
                }, t;
            }(), E = function() {
                function t(t, o) {
                    this.type = "map", this.ins = o, this.out = f, this.f = t;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = s(this, t, o);
                        i !== f && o._n(i);
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), T = function() {
                function t(t) {
                    this.type = "remember", this.ins = t, this.out = f;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.ins._add(t);
                }, t.prototype._stop = function() {
                    this.ins._remove(this.out), this.out = f;
                }, t;
            }(), P = function() {
                function t(t, o) {
                    this.type = "replaceError", this.ins = o, this.out = f, this.f = t;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    o !== f && o._n(t);
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    if (o !== f) try {
                        this.ins._remove(this), (this.ins = this.f(t))._add(this);
                    } catch (t) {
                        o._e(t);
                    }
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), M = function() {
                function t(t, o) {
                    this.type = "startWith", this.ins = t, this.out = f, this.val = o;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.out._n(this.val), this.ins._add(t);
                }, t.prototype._stop = function() {
                    this.ins._remove(this.out), this.out = f;
                }, t;
            }(), W = function() {
                function t(t, o) {
                    this.type = "take", this.ins = o, this.out = f, this.max = t, this.taken = 0;
                }
                return t.prototype._start = function(t) {
                    this.out = t, this.taken = 0, this.max <= 0 ? t._c() : this.ins._add(this);
                }, t.prototype._stop = function() {
                    this.ins._remove(this), this.out = f;
                }, t.prototype._n = function(t) {
                    var o = this.out;
                    if (o !== f) {
                        var i = ++this.taken;
                        i < this.max ? o._n(t) : i === this.max && (o._n(t), o._c());
                    }
                }, t.prototype._e = function(t) {
                    var o = this.out;
                    o !== f && o._e(t);
                }, t.prototype._c = function() {
                    var t = this.out;
                    t !== f && t._c();
                }, t;
            }(), L = function() {
                function t(t) {
                    this._prod = t || f, this._ils = [], this._stopID = f, this._dl = f, this._d = !1, 
                    this._target = f, this._err = f;
                }
                return t.prototype._n = function(t) {
                    var o = this._ils, i = o.length;
                    if (this._d && this._dl._n(t), 1 == i) o[0]._n(t); else {
                        if (0 == i) return;
                        for (var n = e(o), r = 0; r < i; r++) n[r]._n(t);
                    }
                }, t.prototype._e = function(t) {
                    if (this._err === f) {
                        this._err = t;
                        var o = this._ils, i = o.length;
                        if (this._x(), this._d && this._dl._e(t), 1 == i) o[0]._e(t); else {
                            if (0 == i) return;
                            for (var n = e(o), r = 0; r < i; r++) n[r]._e(t);
                        }
                        if (!this._d && 0 == i) throw this._err;
                    }
                }, t.prototype._c = function() {
                    var t = this._ils, o = t.length;
                    if (this._x(), this._d && this._dl._c(), 1 == o) t[0]._c(); else {
                        if (0 == o) return;
                        for (var i = e(t), n = 0; n < o; n++) i[n]._c();
                    }
                }, t.prototype._x = function() {
                    0 !== this._ils.length && (this._prod !== f && this._prod._stop(), this._err = f, 
                    this._ils = []);
                }, t.prototype._stopNow = function() {
                    this._prod._stop(), this._err = f, this._stopID = f;
                }, t.prototype._add = function(t) {
                    var o = this._target;
                    if (o !== f) return o._add(t);
                    var i = this._ils;
                    if (i.push(t), !(i.length > 1)) if (this._stopID !== f) clearTimeout(this._stopID), 
                    this._stopID = f; else {
                        var n = this._prod;
                        n !== f && n._start(this);
                    }
                }, t.prototype._remove = function(t) {
                    var o = this, i = this._target;
                    if (i !== f) return i._remove(t);
                    var n = this._ils, e = n.indexOf(t);
                    e > -1 && (n.splice(e, 1), this._prod !== f && n.length <= 0 ? (this._err = f, this._stopID = setTimeout(function() {
                        return o._stopNow();
                    })) : 1 === n.length && this._pruneCycles());
                }, t.prototype._pruneCycles = function() {
                    this._hasNoSinks(this, []) && this._remove(this._ils[0]);
                }, t.prototype._hasNoSinks = function(t, o) {
                    if (-1 !== o.indexOf(t)) return !0;
                    if (t.out === this) return !0;
                    if (t.out && t.out !== f) return this._hasNoSinks(t.out, o.concat(t));
                    if (t._ils) {
                        for (var i = 0, n = t._ils.length; i < n; i++) if (!this._hasNoSinks(t._ils[i], o.concat(t))) return !1;
                        return !0;
                    }
                    return !1;
                }, t.prototype.ctor = function() {
                    return this instanceof j ? j : t;
                }, t.prototype.addListener = function(t) {
                    t._n = t.next || n, t._e = t.error || n, t._c = t.complete || n, this._add(t);
                }, t.prototype.removeListener = function(t) {
                    this._remove(t);
                }, t.prototype.subscribe = function(t) {
                    return this.addListener(t), new _(this, t);
                }, t.prototype[p.default] = function() {
                    return this;
                }, t.create = function(o) {
                    if (o) {
                        if ("function" != typeof o.start || "function" != typeof o.stop) throw new Error("producer requires both start and stop functions");
                        u(o);
                    }
                    return new t(o);
                }, t.createWithMemory = function(t) {
                    return t && u(t), new j(t);
                }, t.never = function() {
                    return new t({
                        _start: n,
                        _stop: n
                    });
                }, t.empty = function() {
                    return new t({
                        _start: function(t) {
                            t._c();
                        },
                        _stop: n
                    });
                }, t.throw = function(o) {
                    return new t({
                        _start: function(t) {
                            t._e(o);
                        },
                        _stop: n
                    });
                }, t.from = function(o) {
                    if ("function" == typeof o[p.default]) return t.fromObservable(o);
                    if ("function" == typeof o.then) return t.fromPromise(o);
                    if (Array.isArray(o)) return t.fromArray(o);
                    throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
                }, t.of = function() {
                    for (var o = [], i = 0; i < arguments.length; i++) o[i] = arguments[i];
                    return t.fromArray(o);
                }, t.fromArray = function(o) {
                    return new t(new m(o));
                }, t.fromPromise = function(o) {
                    return new t(new w(o));
                }, t.fromObservable = function(o) {
                    return o.endWhen ? o : new t(new y(o));
                }, t.periodic = function(o) {
                    return new t(new b(o));
                }, t.prototype._map = function(t) {
                    return new (this.ctor())(new E(t, this));
                }, t.prototype.map = function(t) {
                    return this._map(t);
                }, t.prototype.mapTo = function(t) {
                    var o = this.map(function() {
                        return t;
                    });
                    return o._prod.type = "mapTo", o;
                }, t.prototype.filter = function(o) {
                    var i = this._prod;
                    return new t(i instanceof O ? new O(r(i.f, o), i.ins) : new O(o, this));
                }, t.prototype.take = function(t) {
                    return new (this.ctor())(new W(t, this));
                }, t.prototype.drop = function(o) {
                    return new t(new x(o, this));
                }, t.prototype.last = function() {
                    return new t(new k(this));
                }, t.prototype.startWith = function(t) {
                    return new j(new M(this, t));
                }, t.prototype.endWhen = function(t) {
                    return new (this.ctor())(new A(t, this));
                }, t.prototype.fold = function(t, o) {
                    return new j(new S(t, o, this));
                }, t.prototype.replaceError = function(t) {
                    return new (this.ctor())(new P(t, this));
                }, t.prototype.flatten = function() {
                    this._prod;
                    return new t(new I(this));
                }, t.prototype.compose = function(t) {
                    return t(this);
                }, t.prototype.remember = function() {
                    return new j(new T(this));
                }, t.prototype.debug = function(t) {
                    return new (this.ctor())(new g(this, t));
                }, t.prototype.imitate = function(t) {
                    if (t instanceof j) throw new Error("A MemoryStream was given to imitate(), but it only supports a Stream. Read more about this restriction here: https://github.com/staltz/xstream#faq");
                    this._target = t;
                    for (var o = this._ils, i = o.length, n = 0; n < i; n++) t._add(o[n]);
                    this._ils = [];
                }, t.prototype.shamefullySendNext = function(t) {
                    this._n(t);
                }, t.prototype.shamefullySendError = function(t) {
                    this._e(t);
                }, t.prototype.shamefullySendComplete = function() {
                    this._c();
                }, t.prototype.setDebugListener = function(t) {
                    t ? (this._d = !0, t._n = t.next || n, t._e = t.error || n, t._c = t.complete || n, 
                    this._dl = t) : (this._d = !1, this._dl = f);
                }, t.merge = function() {
                    for (var o = [], i = 0; i < arguments.length; i++) o[i] = arguments[i];
                    return new t(new l(o));
                }, t.combine = function() {
                    for (var o = [], i = 0; i < arguments.length; i++) o[i] = arguments[i];
                    return new t(new v(o));
                }, t;
            }();
            i.Stream = L;
            var j = function(t) {
                function o(o) {
                    var i = t.call(this, o) || this;
                    return i._has = !1, i;
                }
                return h(o, t), o.prototype._n = function(o) {
                    this._v = o, this._has = !0, t.prototype._n.call(this, o);
                }, o.prototype._add = function(t) {
                    var o = this._target;
                    if (o !== f) return o._add(t);
                    var i = this._ils;
                    if (i.push(t), i.length > 1) this._has && t._n(this._v); else if (this._stopID !== f) this._has && t._n(this._v), 
                    clearTimeout(this._stopID), this._stopID = f; else if (this._has) t._n(this._v); else {
                        var n = this._prod;
                        n !== f && n._start(this);
                    }
                }, o.prototype._stopNow = function() {
                    this._has = !1, t.prototype._stopNow.call(this);
                }, o.prototype._x = function() {
                    this._has = !1, t.prototype._x.call(this);
                }, o.prototype.map = function(t) {
                    return this._map(t);
                }, o.prototype.mapTo = function(o) {
                    return t.prototype.mapTo.call(this, o);
                }, o.prototype.take = function(o) {
                    return t.prototype.take.call(this, o);
                }, o.prototype.endWhen = function(o) {
                    return t.prototype.endWhen.call(this, o);
                }, o.prototype.replaceError = function(o) {
                    return t.prototype.replaceError.call(this, o);
                }, o.prototype.remember = function() {
                    return this;
                }, o.prototype.debug = function(o) {
                    return t.prototype.debug.call(this, o);
                }, o;
            }(L);
            i.MemoryStream = j, i.default = L;
        }, {
            "symbol-observable": 2
        } ],
        2: [ function(t, o, i) {
            o.exports = t("./lib/index");
        }, {
            "./lib/index": 3
        } ],
        3: [ function(t, o, i) {
            (function(n) {
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var e, r = function(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    };
                }(t("./ponyfill"));
                e = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n ? n : void 0 !== o ? o : Function("return this")();
                var s = (0, r.default)(e);
                i.default = s;
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./ponyfill": 4
        } ],
        4: [ function(t, o, i) {
            Object.defineProperty(i, "__esModule", {
                value: !0
            }), i.default = function(t) {
                var o, i = t.Symbol;
                return "function" == typeof i ? i.observable ? o = i.observable : (o = i("observable"), 
                i.observable = o) : o = "@@observable", o;
            };
        }, {} ]
    }, {}, [ 1 ])(1);
});