!function(t) {
    function n() {}
    function e(t, n) {
        e._super.call(this, t, n);
    }
    function i(t, n) {
        i._super.call(this, t, n), this._nid = 1, this._cid = 1, this._eid = 1, this._prevVal = d;
    }
    function o(t, n) {
        o._super.call(this, t, n);
    }
    function r(t, n) {
        this.delayCount = 0, r._super.call(this, t, n);
    }
    function u(t, n) {
        u._super.call(this, t, n);
    }
    function s(t, n) {
        var e = this;
        s._super.call(this, t, n), this.streams = [], this._proxy = {
            _n: function(t) {
                var n = e.out;
                n !== d && n._n(t);
            },
            _c: function() {
                e.streams.shift(), e.startNext();
            },
            _e: function(t) {
                e._e(t);
            }
        };
    }
    function c(t, n) {
        this.latestVal = d, c._super.call(this, t, n);
    }
    function h(t, n) {
        h._super.call(this, t, n), this._prevVal = d;
    }
    function a(t, n) {
        this._cache = d, a._super.call(this, t, n);
    }
    function _(t, n) {
        _._super.call(this, t, n), this.param = t || 1;
    }
    function p(t, n) {
        p._super.call(this, t, n), this._wrap = [], this._nid = 1, this._cid = 1, this._eid = 1;
    }
    function f(t, n) {
        f._super.call(this, t, n), this.taskCount = 0, this.queue = [];
    }
    var l = t.xstream, d = l.NO, y = (l.NO_IL, l.MemoryStream, l.Stream), m = Object.assign;
    t.xstream.noop = n;
    var F = function() {
        function t(t, n) {
            for (var e in n) n.hasOwnProperty(e) && (t[e] = n[e]);
        }
        var n = Object.create ? function(t, n) {
            var e = Object.create(t);
            return e.constructor = n, e;
        } : function(t, n) {
            function e() {}
            e.prototype = t;
            var i = new e();
            return i.constructor = n, i;
        };
        return function(e, i) {
            t(e, i), e._super = i, e.prototype = n(i.prototype, e);
        };
    }(), w = function() {
        function t(t) {
            return function(n) {
                var e = this.out, i = t + "Fn";
                e !== d && (this[i] && this[i](n, e) === d || e[t](n));
            };
        }
        function n(t, n) {
            this.ins = n, this.out = d, this.param = t;
        }
        return m(n.prototype, {
            _start: function(t) {
                this.startFn && this.startFn(t) === d || (this.out = t, this.ins._add(this));
            },
            _stop: function() {
                this.stopFn && this.stopFn() === d || (this.ins._remove(this), this.out = d);
            },
            _n: t("_n"),
            _e: t("_e"),
            _c: t("_c")
        }), n;
    }();
    F(e, w), m(e.prototype, {
        type: "throttle",
        stopFn: function() {
            this.throttle$ && this.throttle$._remove(this._throttleProd), this.throttle$ = this._throttleProd = null;
        },
        _unlock: function() {
            this.stopFn(), this._lock = !1;
        },
        _nFn: function(t, n) {
            var e = this;
            return e.throttle$ || (e.throttle$ = e.param(t), e.throttle$._add(e._throttleProd = {
                _n: function() {
                    e._unlock();
                },
                _e: function(t) {
                    e.throttle$ = !1, n._e(t);
                },
                _c: function() {
                    e._unlock();
                }
            })), e._lock || (n._n(t), e._lock = !0), d;
        }
    }), F(i, w), i.fnFactory = function(t) {
        return function(n, e) {
            function i() {
                return u === r[t + "id"];
            }
            function o() {
                r.stopFn(), e[t](n), r._prevVal = d;
            }
            var r = this, u = ++this[t + "id"];
            return "_n" == t ? (r._prevVal = n, r.stopFn(), r.debounce$ = r.param(n), r.debounce$._add(r._debounceProd = {
                _n: function() {
                    i() && o();
                },
                _e: function(t) {
                    i() && (r.debounce$ = null, e._e(t));
                },
                _c: function() {
                    i() && (o(), r.debounce$ = !1);
                }
            })) : ("_c" === t && r._prevVal !== d && e._n(r._prevVal), o()), d;
        };
    }, m(i.prototype, {
        type: "debounce",
        stopFn: function() {
            this.debounce$ && this.debounce$._remove(this._debounceProd), this.debounce$ = this._debounceProd = null;
        },
        _nFn: i.fnFactory("_n"),
        _cFn: i.fnFactory("_c")
    }), F(o, w), m(o.prototype, {
        type: "do",
        _nFn: function(t, n) {
            try {
                this.param(t);
            } catch (t) {
                return n._e(t), d;
            }
        }
    }), F(r, w), m(r.prototype, {
        type: "delayWhen",
        startFn: function() {
            this.open = !0;
        },
        _nFn: function(t, n) {
            function e() {
                u && u._remove(o), u = o = null;
            }
            function i() {
                u && (n._n(t), r.delayCount--, r.open || r._c()), e();
            }
            var o, r = this, u = this.param(t);
            return r.delayCount++, u._add(o = {
                _n: i,
                _c: i,
                _e: function(t) {
                    e(), n._e(t);
                }
            }), d;
        },
        _cFn: function() {
            if (this.open = !1, 0 !== this.delayCount) return d;
        }
    });
    var v = function() {
        function t(t, n) {
            this.prod = n, this.out = t;
        }
        return m(t.prototype, {
            _n: function(t) {
                this.out._n(t);
            },
            _e: function(t) {
                this.out._e(t);
            },
            _c: function() {
                this.prod.inner = d, this.prod.less();
            }
        }), t;
    }();
    F(u, w), m(u.prototype, {
        type: "exhaust",
        startFn: function() {
            this.open = !0, this.inner = d;
        },
        stopFn: function() {},
        _nFn: function(t, n) {
            return this.inner !== d ? d : ((this.inner = t)._add(new v(n, this)), d);
        },
        less: function() {
            this.open || this.inner !== d || this.out._c();
        },
        _cFn: function() {
            return this.open = !1, this.less(), d;
        }
    }), F(s, w), m(s.prototype, {
        type: "concat",
        startNext: function() {
            var t = this.out, n = this.streams;
            t !== d && (n.length ? n[0]._add(this._proxy) : this.open || t._c());
        },
        stopFn: function() {
            var t = this.streams;
            t.length && t[0]._remove(this._proxy), this.streams.splice(0);
        },
        startFn: function() {
            this.open = !0;
        },
        _n: function(t) {
            var n = this.streams;
            this.out !== d && (n.push(t), 1 === n.length && this.startNext());
        },
        _c: function() {
            this.open = !1, this.streams.length || this.startNext();
        }
    }), F(c, w), m(c.prototype, {
        type: "withLatestFrom",
        startFn: function(t) {
            var e = this;
            this.param._add({
                _n: function(t) {
                    e.latestVal = t;
                },
                _e: function(n) {
                    t._e(n);
                },
                _c: n
            });
        },
        _nFn: function(t, n) {
            var e = this.latestVal;
            return e === d ? d : (n._n([ t, e ]), d);
        }
    }), F(h, w), m(h.prototype, {
        type: "distinctUntilChanged",
        _nFn: function(t) {
            if ((this.param || this._compare)(t, this._prevVal)) return d;
            this._prevVal = t;
        },
        _compare: function(t, n) {
            return t === n;
        }
    }), F(a, w), m(a.prototype, {
        type: "cache",
        startFn: function(t) {
            if (this._cache !== d) return t._n(this._cache), t._c(), d;
        },
        _nFn: function(t, n) {
            return this._cache === d && (n._n(this._cache = t), n._c()), d;
        }
    }), F(_, w), m(_.prototype, {
        type: "retry",
        startFn: function() {
            this.count = this.param;
        },
        _eFn: function() {
            var t = this;
            if (this.count) return this.count--, setTimeout(function() {
                return t.ins._add(t);
            }), d;
        }
    }), F(p, w), p.fnFactory = function(t) {
        return function(n, e) {
            function i() {
                return h === r[t + "id"];
            }
            function o() {
                u.length && e[t](u.splice(0));
            }
            var r = this, u = this._wrap, s = this.param[0], c = this.param[1] || -1, h = ++this[t + "id"];
            return u.push(n), "_n" == t ? (r.debounce$ && r.debounce$._remove(r._debounceProd), 
            c > 0 && u.length >= c ? o() : (r.debounce$ = s(n), r.debounce$._add(r._debounceProd = {
                _n: function() {
                    i() && o();
                },
                _e: function(t) {
                    i() && (r.debounce$ = null, e._e(t));
                },
                _c: function() {
                    i() && (o(), r.debounce$ = !1);
                }
            }))) : ("_c" === t && u.length && e._n(u.splice(0)), o()), d;
        };
    }, m(p.prototype, {
        type: "warpGroup",
        stopFn: function() {
            this.debounce$ && this.debounce$._remove(this._debounceProd), this.debounce$ = this._debounceProd = null;
        },
        _nFn: p.fnFactory("_n"),
        _cFn: p.fnFactory("_c")
    }), F(f, w), m(f.prototype, {
        type: "concurrence",
        releaseOne: function() {
            var t = this.out;
            if (t !== d) {
                if (--this.taskCount < 0) throw "Concurrence taskCount have a bug!!!!";
                this.taskCount <= 0 && !this.open && t._c(), this.queue.length && this._nFn(this.queue.shift(), t);
            }
        },
        startFn: function() {
            this.open = !0;
        },
        stopFn: function() {
            this.queue.splice(0), this.taskCount = 0, this.open = !1;
        },
        _cFn: function() {
            if (this.taskCount > 0) return this.open = !1, d;
        },
        _nFn: function(t, n) {
            var e = this, i = this.param[1], o = this.param[0];
            return e.taskCount < i ? (e.taskCount++, o(t)._add({
                _n: function(t) {
                    n._n(t);
                },
                _c: function() {
                    e.releaseOne();
                },
                _e: function(t) {
                    n._e(t), e.releaseOne();
                }
            })) : e.queue.push(t), d;
        }
    }), m(y.prototype, {
        flattenMap: function(t) {
            return this.map(t).flatten();
        },
        cache: function() {
            return new y(new a(null, this));
        },
        throttle: function(t) {
            return new y(new e(t, this));
        },
        throttleTime: function(t) {
            return new y(new e(function() {
                return y.periodic(t);
            }, this));
        },
        debounce: function(t) {
            return new y(new i(t, this));
        },
        debounceTime: function(t) {
            return new y(new i(function() {
                return y.periodic(t);
            }, this));
        },
        do: function(t) {
            return new y(new o(t, this));
        },
        delay: function(t) {
            return new y(new r(function() {
                return y.create({
                    start: function(n) {
                        this.timer = setTimeout(function() {
                            n.next(), n.complete();
                        }, t);
                    },
                    stop: function() {
                        clearTimeout(this.timer);
                    }
                });
            }, this));
        },
        delayWhen: function(t) {
            return new y(new r(t, this));
        },
        partition: function(t) {
            return [ this.filter(function(n) {
                return t(n);
            }), this.filter(function(n) {
                return !1 === t(n);
            }) ];
        },
        exhaust: function() {
            return new y(new u(null, this));
        },
        exhaustMap: function(t) {
            return this.map(t).exhaust();
        },
        concat: function() {
            return new y(new s(null, this));
        },
        concatMap: function(t) {
            return this.map(t).concat();
        },
        withLatestFrom: function(t) {
            return new y(new c(t, this));
        },
        distinctUntilChanged: function(t) {
            return new y(new h(t, this));
        },
        retry: function(t) {
            return new y(new _(t, this));
        },
        warpGroup: function(t, n) {
            var e = t;
            return "number" == typeof t && (t = function() {
                return y.periodic(e);
            }), new y(new p([ t, n ], this));
        },
        concurrence: function(t, n) {
            return new y(new f(arguments, this));
        }
    });
}(wx);