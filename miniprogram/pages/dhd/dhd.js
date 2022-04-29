// pages/dhd/dhd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: 'http://localhost:8080/'
            // url: 'https://dhd.wagoz.cn/'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let token = wx.getStorageSync('token')
        this.setData({
            url: `${this.data.url}?token=${token}`
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.hideHomeButton()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '大家人，来钓红点罗',
            path: '/pages/index/index',
            imageUrl: "https://dhd.wagoz.cn/img/dhdshare.jpg" //自定义图片的地址
        }
    }
})