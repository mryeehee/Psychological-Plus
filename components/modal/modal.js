function a(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

function e(e, t) {
    var n;
    e.setData((n = {}, a(n, t + ".animateMaskClass", "d-b"), a(n, t + ".animateModalClass", "d-b"), 
    n));
    for (var s = 0; e["yxlModalHandler" + t + s]; ) delete e["yxlModalHandler" + t + s], 
    s++;
    setTimeout(function() {
        var n;
        e.setData((n = {}, a(n, t + ".animateMaskClass", ""), a(n, t + ".animateModalClass", ""), 
        n));
    }, 500);
}

var t = require("../../utils/core.js"), n = {
    mask: !0,
    maskClose: !1,
    closeBtn: !1,
    onUserClose: function() {},
    maskAnimteTypeClass: " yxl-modal-mask-enter",
    modalAnimteTypeClass: " yxl-modal-enter"
};

module.exports = {
    show: function(s, l, o) {
        function i() {
            e(s, l);
        }
        var r = t.extend({
            bind: l,
            animateMaskClass: "d-b",
            animateModalClass: "d-b"
        }, n, o);
        s.setData(a({}, l, r)), setTimeout(function() {
            var e;
            s.setData((e = {}, a(e, l + ".animateMaskClass", "d-b" + r.maskAnimteTypeClass), 
            a(e, l + ".animateModalClass", "d-b" + r.modalAnimteTypeClass), e));
        }, 100), o.buttons.forEach(function(a, e) {
            var t = a.behavior;
            s["yxlModalHandler" + l + e] = "function" == typeof t ? function() {
                t(i);
            } : i;
        }), s["yxlModalHandler" + l + o.buttons.length] = function() {
            i(), r.onUserClose();
        };
    },
    hide: e
};