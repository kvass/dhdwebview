//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
    data: {
        avatarUrl: './user-unlogin.png',
        nickName: '请授权头像和呢称',
        userInfo: {},
        logged: false,
        score: '',
        startText: '用微信名就好',
        hasUserInfo: true,
        loading: true,
        loadingText: '等下啊，罗准备…',
        // apiUrl: 'https://api.wagoz.cn/api/'
        apiUrl: 'http://localhost:8091/'
    },
    onLoad: function() {
        let Token = wx.getStorageSync('token')
        let that = this
        // 查看有没有 token：
        // 无：调用登录接口取得openid，
        // 有：把 token 传回服务端，由服务端验证 token 是否过期；

        if (Token) {
            wx.request({
                url: that.data.apiUrl + 'checkSession',
                method: "get",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + Token
                },
                success(res) {
                    if (res.data) {
                        if (res.data.state) {
                            wx.redirectTo({
                                url: '/pages/dhd/dhd'
                            })
                        } else {
                            that.login()
                        }
                    } else {
                        // token出错（过期等）报其他错误时
                        that.login()
                    }
                }
            })
        } else {
            that.login()
        }
    },
    login() {
        let that = this
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: that.data.apiUrl + 'login',
                        data: {
                            code: res.code
                        },
                        success: res => {
                            let hasUserInfo = false
                            let Token = res.data.token
                            wx.setStorageSync('token', Token)
                            if (res.data.state) {
                                // wx.setStorageSync('openId', res.data.openId)
                                hasUserInfo = true
                                wx.redirectTo({
                                    url: '/pages/dhd/dhd'
                                })
                            } else {
                                console.log('不存在用户信息，需要授权进行注册。');
                                hasUserInfo = false
                            }
                            // 去掉 loading 效果，或跳转或让用户授权
                            that.setData({
                                loading: false,
                                hasUserInfo
                            })
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    getUserProfile(e) {
        let that = this
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于方便下办来用', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                let profile = res
                let Token = wx.getStorageSync('token')
                wx.request({
                    url: this.data.apiUrl + 'user',
                    method: "post",
                    data: profile,
                    header: {
                        Authorization: 'Bearer ' + Token
                    },
                    success: function(res) {
                        if (res.data.token) {
                            wx.setStorageSync('token', res.data.token)
                            wx.redirectTo({
                                url: '/pages/dhd/dhd'
                            })
                        } else {
                            that.login()
                        }
                    }
                })
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
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
    onShareAppMessage: function() {
        return {
            title: '大家人，来钓红点罗',
            path: '/pages/index/index',
            imageUrl: "https://dhd.wagoz.cn/img/dhdshare.jpg" //自定义图片的地址
        }
    }
})