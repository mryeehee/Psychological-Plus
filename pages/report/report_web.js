Page({
    data: {},
    onLoad: function(t) {
        wx.canIUse && wx.canIUse("web-view") ? this.setData({
            web_url: decodeURIComponent ? decodeURIComponent(t.dataUrl) : t.dataUrl
        }) : wx.modalAPI.show(this, "modalConfig", {
            content: "请升级微信客户端至最新版再重试，跪谢~",
            closeBtn: !1,
            buttons: [ {
                text: "知道了",
                behavior: function() {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            } ]
        });
    }
});