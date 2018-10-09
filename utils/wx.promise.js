var e = wx.Promise;

wx.getDomInfoPr = function(n) {
    return new e(function(e, t) {
        wx.createSelectorQuery ? wx.createSelectorQuery().select(n).boundingClientRect(e).exec() : t();
    });
}, wx.getSettingPr = function() {
    return new e(function(e, n) {
        wx.getSetting({
            success: e,
            fail: n
        });
    });
}, wx.getUserInfoPr = function() {
    var n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    return new e(function(e, t) {
        wx.getUserInfo({
            withCredentials: n,
            success: e,
            fail: t
        });
    });
}, wx.canvasToTempFilePathPr = function(n) {
    return new e(function(e, t) {
        wx.canvasToTempFilePath({
            canvasId: n,
            success: function(n) {
                e(n.tempFilePath);
            },
            fail: t
        });
    });
}, wx.getImageInfoPr = function(n) {
    return new e(function(e, t) {
        wx.getImageInfo({
            src: n,
            success: e,
            fail: t
        });
    });
};