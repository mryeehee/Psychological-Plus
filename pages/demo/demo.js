Page({
    data: {
        frontAnimate: null,
        backAnimate: null
    },
    onLoad: function() {
        var t = this, a = wx.createAnimation({
            duration: 0
        });
        a.rotateY(180).step(), t.setData({
            backAnimate: a.export()
        }), setTimeout(function() {
            var a = wx.createAnimation({
                duration: 4e3
            }), e = wx.createAnimation({
                duration: 4e3
            });
            e.rotateY(180).step(), a.rotateY(360).step(), t.setData({
                frontAnimate: e.export(),
                backAnimate: a.export()
            });
        }, 2e3);
    }
});