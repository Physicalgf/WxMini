// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: '',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) { 
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  getUserInfo(e) {
    wx.login({
      success: async (loginRes) => {
        // 这里可以获得登录凭证code
        console.log('login code:', loginRes.code);
  
        try {
          // 使用await关键字等待请求完成，注意在Page的定义外或async函数内使用
          const backendResponse = await getApp().httpSend('api/Person/GetWxMiniCode', 'POST', { code: loginRes.code,name:this.data.userInfo.nickName });
          console.log('后端响应:', backendResponse);
  
          // 根据后端返回的数据处理后续逻辑，例如跳转页面或设置用户状态
          if (backendResponse.success) {
            // 成功处理，假设返回了用户ID
            const userId = backendResponse.data.userId;
            this.navigateToHome(userId);
          } else {
            wx.showToast({
              title: '登录失败，请重试',
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('请求后端失败', error);
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
  
        // 调用getUserProfile获取用户信息，根据实际需求决定是否在此处调用
        this.getUserProfile();
      },
      fail: (err) => {
        console.error('登录失败', err);
        wx.showToast({
          title: '登录接口调用失败',
          icon: 'none'
        });
      }
    });
  },
})
