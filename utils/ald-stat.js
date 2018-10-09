var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function() {
    function a(t) {
        var a = wx.getStorageSync("aldstat_uuid");
        return a || (a = "" + Date.now() + Math.floor(1e7 * Math.random()), wx.setStorageSync("aldstat_uuid", a), 
        t.aldstat_is_first_open = !0), a;
    }
    function s() {
        wx.request({
            url: "https://" + l + ".aldwx.com/config/app.json",
            header: {
                AldStat: "MiniApp-Stat"
            },
            method: "GET",
            success: function(t) {
                if (200 === t.statusCode) for (var a in t.data) wx.setStorageSync(a, t.data[a]);
            }
        });
    }
    function e(t, a, s) {
        if (t[a]) {
            var e = t[a];
            t[a] = function(t) {
                s.call(this, t, a), e.call(this, t);
            };
        } else t[a] = function(t) {
            s.call(this, t, a);
        };
    }
    function n(t, a, s) {
        if (t[a]) {
            var e = t[a];
            t[a] = function(t) {
                var n = e.call(this, t);
                return s.call(this, [ t, n ], a), n;
            };
        } else t[a] = function(t) {
            s.call(this, t, a);
        };
    }
    function o(t) {
        this.app = t;
    }
    function _(t) {
        for (var a in t) return !1;
        return !0;
    }
    var r = "5.3.10", l = "log", i = require("./ald-stat-conf.js"), d = 0, c = 0, u = 0, p = 0, h = function(t) {
        wx.login({
            success: function(a) {
                wx.getUserInfo({
                    success: function(a) {
                        t(a);
                    }
                });
            }
        });
    }, g = function(t, a, s) {
        void 0 === arguments[1] && (a = "GET"), void 0 === arguments[2] && (s = "d.html");
        var e = 0;
        !function n() {
            d += 1, t.rq_c = d, wx.request({
                url: "https://" + l + ".aldwx.com/" + s,
                data: t,
                header: {
                    AldStat: "MiniApp-Stat"
                },
                method: a,
                success: function() {},
                fail: function() {
                    2 > e && (e++, t.retryTimes = e, n());
                }
            });
        }();
    }, w = function(t, s, e, n) {
        var o = {
            ak: i.app_key,
            uu: a(t),
            at: t.aldstat_access_token,
            ts: Date.now(),
            tp: e,
            ev: s,
            v: r
        };
        n && (o.ct = n), t.aldstat_qr && (o.qr = t.aldstat_qr), g(o, "GET", "d.html");
    }, f = function(t, s, e, n) {
        void 0 === t.aldstat_showoption && (t.aldstat_showoption = []);
        var o = {
            ak: i.app_key,
            wsr: t.aldstat_showoption,
            uu: a(t),
            at: t.aldstat_access_token,
            ts: Date.now(),
            tp: e,
            ev: s,
            nt: t.aldstat_network_type,
            pm: t.aldstat_phone_model,
            pr: t.aldstat_pixel_ratio,
            ww: t.aldstat_window_width,
            wh: t.aldstat_window_height,
            lang: t.aldstat_language,
            wv: t.aldstat_wechat_version,
            lat: t.aldstat_lat,
            lng: t.aldstat_lng,
            spd: t.aldstat_speed,
            v: r
        };
        n && (o.ct = n), t.aldstat_location_name && (o.ln = t.aldstat_location_name), t.aldstat_src && (o.sr = t.aldstat_src), 
        t.aldstat_qr && (o.qr = t.aldstat_qr), g(o, "GET", "d.html");
    };
    o.prototype.debug = function(t) {
        f(this.app, "debug", 0, t);
    }, o.prototype.warn = function(t) {
        f(this.app, "debug", 1, t);
    }, o.prototype.error = function(t) {
        w(this.app, "debug", 2, t);
    }, o.prototype.sendEvent = function(t, a) {
        _(a) ? f(this.app, "event", t) : f(this.app, "event", t, JSON.stringify(a));
    };
    var v = function() {
        var t = this;
        t.aldstat_duration += Date.now() - t.aldstat_showtime, x(t, "app", "unLaunch");
    }, S = function(t, a, s) {
        void 0 !== wx.getShareInfo ? wx.getShareInfo({
            shareTicket: a,
            success: function(a) {
                f(t, "event", "ald_share_" + s, JSON.stringify(a));
            },
            fail: function() {
                f(t, "event", "ald_share_" + s, "1");
            }
        }) : f(t, "event", "ald_share_" + s, "1");
    }, m = function(t) {
        s(), this.aldstat = new o(this);
        var e = wx.getStorageSync("aldstat_src");
        e && (this.aldstat_src = e);
        var n = a(this);
        this.aldstat_uuid = n, this.aldstat_timestamp = Date.now(), this.aldstat_showtime = Date.now(), 
        this.aldstat_duration = 0;
        var _ = this;
        _.aldstat_error_count = 0, _.aldstat_page_count = 1, _.aldstat_first_page = 0, this.aldstat_showoption = void 0 !== t ? t : {};
        var r = function() {
            wx.getSystemInfo({
                success: function(t) {
                    _.aldstat_vsdk_version = void 0 === t.SDKVersion ? "1.0.0" : t.SDKVersion, _.aldstat_phone_model = t.model, 
                    _.aldstat_pixel_ratio = t.pixelRatio, _.aldstat_window_width = t.windowWidth, _.aldstat_window_height = t.windowHeight, 
                    _.aldstat_language = t.language, _.aldstat_wechat_version = t.version;
                },
                complete: function() {
                    i.getLocation && d(), i.getUserinfo && l();
                }
            });
        }, l = function() {
            h(function(t) {
                var a = wx.getStorageSync("aldstat_uuid");
                t.userInfo.uu = a, g(t.userInfo, "GET", "u.html");
            });
        }, d = function() {
            wx.getLocation({
                type: "wgs84",
                success: function(t) {
                    _.aldstat_lat = t.latitude, _.aldstat_lng = t.longitude, _.aldstat_speed = t.speed;
                }
            });
        };
        wx.getNetworkType({
            success: function(t) {
                _.aldstat_network_type = t.networkType;
            },
            complete: r
        });
        var c = wx.getStorageSync("app_session_key_create_launch_upload");
        c ? c > 0 && "number" == typeof c && (_.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random())) : _.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random()), 
        x(_, "app", "launch");
    }, y = function(t, a) {
        var s = getApp();
        void 0 === this.aldstat_error_count ? this.aldstat_error_count = 1 : this.aldstat_error_count++, 
        f(s, "event", "ald_error_message", JSON.stringify(t));
    }, x = function(t, s, e) {
        var n = wx.getStorageSync("app_" + e + "_upload");
        if (!(!n && "launch" !== e || 1 > n && "number" == typeof n)) {
            void 0 === t.aldstat_timestamp && (t.aldstat_timestamp = Date.now()), t.aldstat_duration += Date.now() - t.aldstat_showtime;
            var o = wx.getSystemInfoSync();
            t.aldstat_vsdk_version = void 0 === o.SDKVersion ? "1.0.0" : o.SDKVersion, t.aldstat_phone_model = o.model, 
            t.aldstat_pixel_ratio = o.pixelRatio, t.aldstat_window_width = o.windowWidth, t.aldstat_window_height = o.windowHeight, 
            t.aldstat_language = o.language, t.aldstat_wechat_version = o.version;
            var _ = wx.getStorageSync("aldstat_vsdk_version"), l = {
                ak: i.app_key,
                waid: i.appid,
                wst: i.appsecret,
                uu: a(t),
                at: t.aldstat_access_token,
                wsr: t.aldstat_showoption,
                st: t.aldstat_timestamp,
                dr: t.aldstat_duration,
                et: Date.now(),
                pc: t.aldstat_page_count,
                fp: t.aldstat_first_page,
                lp: t.aldstat_last_page,
                life: e,
                ec: t.aldstat_error_count,
                nt: t.aldstat_network_type,
                pm: t.aldstat_phone_model,
                wsdk: _,
                pr: t.aldstat_pixel_ratio,
                ww: t.aldstat_window_width,
                wh: t.aldstat_window_height,
                lang: t.aldstat_language,
                wv: t.aldstat_wechat_version,
                lat: t.aldstat_lat,
                lng: t.aldstat_lng,
                spd: t.aldstat_speed,
                v: r,
                ev: s
            };
            "launch" === e ? c += 1 : "show" === e ? u += 1 : p += 1, l.la_c = c, l.as_c = u, 
            l.ah_c = p, t.page_share_count && "number" == typeof t.page_share_count && (l.sc = t.page_share_count), 
            t.aldstat_is_first_open && (l.ifo = "true"), t.aldstat_location_name && (l.ln = t.aldstat_location_name), 
            t.aldstat_src && (l.sr = t.aldstat_src), t.aldstat_qr && (l.qr = t.aldstat_qr), 
            t.ald_share_src && (l.usr = t.ald_share_src), g(l, "GET", "d.html");
        }
    }, k = function(t) {
        this.aldstat_showtime = Date.now(), this.aldstat_showoption = void 0 !== t ? t : {};
        var a = wx.getStorageSync("app_session_key_create_show_upload");
        a && a > 0 && "number" == typeof a && (this.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random())), 
        this.aldstat_duration += Date.now() - this.aldstat_showtime, x(this, "app", "show"), 
        void 0 !== t && (void 0 !== t.shareTicket ? S(this, t.shareTicket, "click") : void 0 !== t.query && void 0 !== t.query.ald_share_src && S(this, "0", "click"));
    }, D = function(t, a) {
        var s = this;
        s.aldstat_is_first_open && (s.aldstat_is_first_open = !1), s.aldstat_duration += Date.now() - s.aldstat_showtime, 
        x(s, "app", "hide");
    }, q = App;
    App = function(t) {
        e(t, "onLaunch", m), e(t, "onUnlaunch", v), e(t, "onShow", k), e(t, "onHide", D), 
        e(t, "onError", y), q(t);
    };
    var b = function(t, a) {
        var s = getApp();
        M(s, this, "hide");
    }, A = function(t, a) {
        var s = getApp();
        M(s, this, "unload");
    }, T = function(t, a) {
        var s = wx.getStorageSync("aldstat_src");
        wx.showShareMenu;
        var e = getApp();
        if (s && (e.aldstat_src = s), !_(t)) {
            void 0 !== t.aldsrc && (s ? e.aldstat_qr = t.aldsrc : (wx.setStorageSync("aldstat_src", t.aldsrc), 
            e.aldstat_src = t.aldsrc, e.aldstat_qr = t.aldsrc));
            wx.getStorageSync("aldstat_uuid");
            void 0 !== t.ald_share_src && (e.ald_share_src = t.ald_share_src), this.aldstat_page_args = JSON.stringify(t);
        }
        M(e, this, "load");
    }, M = function(t, s, e) {
        var n = wx.getStorageSync("page_" + e + "_upload");
        if (!(!n && "show" !== e || 1 > n && "number" == typeof n)) {
            s.aldstat_start_time = Date.now(), s.aldstat_error_count = 0, t.aldstat_page_count ? t.aldstat_page_count++ : t.aldstat_page_count = 1, 
            t.aldstat_first_page || (t.aldstat_first_page = s.__route__, s.aldstat_is_first_page = !0), 
            t.aldstat_last_page = s.__route__;
            var o = {
                uu: a(t),
                at: t.aldstat_access_token,
                wsr: t.aldstat_showoption,
                ak: i.app_key,
                ev: "page",
                st: s.aldstat_start_time,
                dr: Date.now() - s.aldstat_start_time,
                pp: s.__route__,
                life: e,
                sc: s.page_share_count,
                ec: s.aldstat_error_count,
                nt: t.aldstat_network_type,
                pm: t.aldstat_phone_model,
                pr: t.aldstat_pixel_ratio,
                ww: t.aldstat_window_width,
                wh: t.aldstat_window_height,
                lang: t.aldstat_language,
                wv: t.aldstat_wechat_version,
                lat: t.aldstat_lat,
                lng: t.aldstat_lng,
                spd: t.aldstat_speed,
                v: r
            };
            s.aldstat_is_first_page && (o.ifp = "true"), t.aldstat_page_last_page && (o.lp = t.aldstat_page_last_page), 
            t.aldstat_location_name && (o.ln = t.aldstat_location_name), s.aldstat_page_args && (o.ag = s.aldstat_page_args), 
            t.aldstat_src && (o.sr = t.aldstat_src), t.aldstat_qr && (o.qr = t.aldstat_qr), 
            t.ald_share_src && (o.usr = t.ald_share_src), t.aldstat_page_last_page = s.__route__, 
            g(o, "GET", "d.html");
        }
    }, E = function(t, a) {
        var s = getApp();
        M(s, this, "show");
    }, I = function(t, a) {
        var s = getApp();
        f(s, "event", "ald_pulldownrefresh", 1);
    }, G = function(t, a) {
        var s = getApp();
        f(s, "event", "ald_reachbottom", 1);
    }, O = Page, N = function(a, s) {
        var e = this, n = getApp();
        if (void 0 !== a && void 0 !== a[1]) {
            var o = wx.getStorageSync("aldstat_uuid");
            void 0 === a[1].path && (a[1].path = this.path);
            var _ = a[1].path;
            _ && "undefined" !== _ || (_ = i.defaultPath ? i.defaultPath : e.__route__);
            J(_);
            var r = wx.getStorageSync(o), l = "";
            if ("undefined" !== n.ald_share_src && n.ald_share_src) {
                var d = (l = n.ald_share_src).split(",");
                d.length >= 3 && (d.shift(), l = d.toString()), "" !== l && (l = l + "," + o);
            } else l = wx.getStorageSync("aldstat_uuid");
            a[1].path += -1 != _.indexOf("?") ? "&ald_share_src=" + l : "?ald_share_src=" + l, 
            f(n, "event", "ald_share_chain", {
                path: n.aldstat_last_page,
                chain: l
            }), "" === r || void 0 === r ? (wx.setStorageSync(o, 1), r = 1, n.page_share_count = r) : (r = parseInt(wx.getStorageSync(o)) + 1, 
            n.page_share_count = r, wx.setStorageSync(o, r)), h(function(t) {
                var a = wx.getStorageSync("aldstat_uuid");
                t.userInfo.uu = a, g(t.userInfo, "GET", "u.html");
            });
            a[1];
            void 0 === a[1].success && (a[1].success = function(t) {}), void 0 === a[1].fail && (a[1].fail = function(t) {});
            var c = a[1].fail, u = a[1].success;
            return a[1].success = function(a) {
                new Array();
                if ("object" == t(a.shareTickets)) for (var s = 0; s < a.shareTickets.length; s++) S(n, a.shareTickets[s], "user");
                f(n, "event", "ald_share_status", JSON.stringify(a)), u(a);
            }, a[1].fail = function(t) {
                f(n, "event", "ald_share_status", "fail"), c(t);
            }, a[1];
        }
    }, J = function(t) {
        var a = new Object();
        if (-1 != t.indexOf("?")) for (var s = t.split("?")[1], e = s.split("&"), n = 0; n < e.length; n++) a[e[n].split("=")[0]] = unescape(e[n].split("=")[1]); else a = t;
        return a;
    };
    Page = function(t) {
        e(t, "onLoad", T), e(t, "onUnload", A), e(t, "onShow", E), e(t, "onHide", b), e(t, "onReachBottom", G), 
        e(t, "onPullDownRefresh", I), void 0 !== t.onShareAppMessage && n(t, "onShareAppMessage", N), 
        O(t);
    };
}();