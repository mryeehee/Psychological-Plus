function t() {}

var e = wx.xstream.Stream;

wx.Promise;

e.fromEvent = function(t, r) {
    return e.create({
        start: function(e) {
            r[t] = function(t) {
                e.next(t);
            };
        },
        stop: function() {
            delete r[t];
        }
    });
}, e.prototype.pardonError = function(t) {
    return this.replaceError(function(r) {
        return t && t(r), e.of(null);
    });
}, wx.getImageInfoStream = function(t) {
    return e.fromPromise(wx.getImageInfoPr(t));
}, wx.getElementInfoStream = function(r, n) {
    return e.create({
        start: function(t) {
            wx.createSelectorQuery ? wx.createSelectorQuery()[n ? "selectAll" : "select"](r).boundingClientRect(function(e) {
                t.next(e), t.complete();
            }).exec() : t.error();
        },
        stop: t
    });
}, wx.downloadFileStream = function(t) {
    return e.create({
        start: function(e) {
            var r = this.task = wx.downloadFile({
                url: t,
                success: function(t) {
                    200 === t.statusCode ? (e.next(t), e.complete()) : e.error(t);
                },
                fail: function(t) {
                    return e.error(t);
                }
            });
            r && r.onProgressUpdate && r.onProgressUpdate(function(t) {
                return e.next(t);
            });
        },
        stop: function() {
            this.task && this.task.abort && this.task.abort();
        }
    });
}, wx.getSettingStream = function() {
    return e.fromPromise(wx.getSettingPr());
};