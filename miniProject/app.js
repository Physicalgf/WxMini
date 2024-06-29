// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })


    this.globalData.backendBaseUrl = 'http://192.168.31.235:9991/';




  },
  globalData: {
    userInfo: null
  },

  // 定义全局的请求后端函数
  httpSend(url, method = 'GET', data = {}, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.backendBaseUrl + url, // 结合全局的后端基础URL
        method,
        data,
        header: Object.assign({'content-type': 'application/json'}, header),
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
})
