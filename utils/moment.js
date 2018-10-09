function e(e) {
    return ("0" + e).slice(-2);
}

var n = function() {
    function n(e) {
        if (!(this instanceof n)) return new n(e);
        this.date = new Date(e);
    }
    var t, r = {
        YYYY: {
            exp: function(e) {
                return e.getFullYear();
            }
        },
        MM: {
            exp: function(n) {
                return e(n.getMonth() + 1);
            }
        },
        DD: {
            exp: function(n) {
                return e(n.getDate());
            }
        },
        hh: {
            exp: function(n) {
                return e(n.getHours());
            }
        },
        mm: {
            exp: function(n) {
                return e(n.getMinutes());
            }
        },
        ss: {
            exp: function(n) {
                return e(n.getSeconds());
            }
        }
    };
    for (t in r) r.hasOwnProperty(t) && (r[t].reg = new RegExp(t + "((?=\\[)|(?=[^\\]]+\\[)|(?=[^\\]]*$))", "g"));
    return n.prototype = {
        format: function(e) {
            var n, t = this.date;
            for (n in r) r.hasOwnProperty(n) && (e = e.replace(r[n].reg, function() {
                return r[n].exp(t);
            }));
            return e.replace(/\[([^\[\]]*)\]/g, function(e, n) {
                return n;
            });
        }
    }, "function" == typeof define && define("moment", function() {
        return n;
    }), n;
}();

module.exports = n;