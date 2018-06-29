export function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}


export function showToast(title) {
  wx.showToast({
    title: title,
    icon: 'none'
  })
}

export function debounce(func, delay) {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this)
    }, delay)
  }
}

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns {string} 带一位小数的随机数
 */
export function getRandomDecimal(min, max) {
  return (min + (max - min) * Math.random()).toFixed(1)
}

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns {Number} 整数随机数
 */
export function getRandomNum(min, max) {
  return parseInt(min + (max - min) * Math.random())
}


//将位置转换为地址
export function reverseGeocoder(qqmapsdk, {latitude, longitude}) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: (res) => resolve(res),
      fail: (res) => reject(res)
    })
  })
}


/**
 * @param num 传入一个数
 * @returns {boolean} 是小数返回true
 */
export function isDecimalNum(num) {
  return String(num).indexOf('.') !== -1
}


