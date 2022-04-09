//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
    data: {
        avatarUrl: './user-unlogin.png',
        nickName: '请授权头像和呢称',
        userInfo: {},
        logged: false,
        desks: [],
        Did: '',
        DName: '',
        DNum: '',
        score: '',
        startText: '用微信名就好',
        hasUserInfo: false,
        loading: true,
        loadingText: '等下啊，罗准备…'
    },
    onLoad: function() {
        // wx.getSetting({
        //     success(res) {
        //         console.log(res.authSetting)
        //             // res.authSetting = {
        //             //   "scope.userInfo": true,
        //             //   "scope.userLocation": true
        //             // }
        //     }
        // })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                console.log('到这里C')
            }
        })
        this.hasUserInfo()
    },
    getUserProfile(e) {
        this.setData({
            loading: true,
            loadingText: '等下啊……'
        })
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                const { avatarUrl, nickName, gender, city } = res.userInfo;
                // 把用户的信息，走reg函数存进库里
                wx.cloud.callFunction({
                    name: 'reg',
                    data: {
                        avatarUrl,
                        nickName,
                        gender,
                        city
                    },
                    success: res => {
                        let { avatarUrl, nickName, score, openid } = res.result
                        this.setData({
                            hasUserInfo: true,
                            avatarUrl,
                            nickName,
                            score,
                            loading: false,
                            loadingText: ''
                        })
                    },
                    fail: err => { console.error('[云函数] [login] 调用失败', err) }
                })
            }
        })
    },
    hasUserInfo: function() {
        // 已经授权，调用 getUserInfo 获取头像昵称
        wx.cloud.callFunction({
            name: 'getUserInfo',
            success: res => {
                if (res.result.length) {
                    this.setData({
                        avatarUrl: res.result[0].avatarUrl,
                        userInfo: res.result[0],
                        nickName: res.result[0].nickName,
                        score: res.result[0].score,
                        hasUserInfo: true,
                        loading: false,
                        startText: '开始钓红点'
                    })
                    wx.setStorageSync('myInfo', res.result[0]);
                } else {
                    this.setData({
                        loading: false,
                        loadingText: ''
                    })
                }
            }
        })
    },
    startDHD(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        if (this.data.hasUserInfo) {
            this.setData({
                loading: true,
                loadingText: '等一下啊，即将开始'
            })
            wx.cloud.callFunction({
                name: 'startAlone',
                success: res => {
                    wx.setStorageSync('opponents', res.result.playerObj);
                    wx.setStorageSync('OCards', res.result.originCards);
                    wx.setStorageSync('panId', res.result.panId);
                    wx.redirectTo({
                        url: '/pages/pan/pan'
                    })
                }
            })
        }
    },
    onShareAppMessage: function() {
        return {
            title: '来钓红点罗',
            path: '/pages/index/index',
            imageUrl: "https://dhd.wagoz.cn/img/dhdshare.png" //自定义图片的地址
        }
    }
})