import {baseUrl} from './config'
import {showToast} from '../utils/index'

export function request(url, method = 'GET', data, header = {}) {
  return new Promise((resolve, reject) => {
    wx.showLoading({title: '玩命加载中...'})
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: {'Content-Type': 'json'},
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          showToast('发生未知错误!')
          reject(res.data)
        }
      },
      fail: function () {
        showToast('获取数据失败!')
      },
      complete:function () {
        wx.hideLoading()
      }
    })
  })
}
