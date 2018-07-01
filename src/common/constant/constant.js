import {getRandomNum} from '../../utils/index'
const cost = getRandomNum(10, 25);

export const swipers = ['会员', '套餐', '招募', '接机', '送机', '后续完善']

export const QQ_MAP_key = 'YJRBZ-LPWRX-AXN4O-7EFWE-LUHI6-PIFU4'

//目的地
export const INIT_DESTINATION = '你要去哪儿'


export const carCostArr = [
  {
    id: 0,
    name: '拼车',
    imgUrl: '/static/img/costCart.png',
    cost: cost
  },
  {
    id: 1,
    name: '快车',
    imgUrl: '/static/img/costCart.png',
    cost: parseInt(cost) + 8.8
  },
  {
    id: 2,
    name: '优享',
    imgUrl: '/static/img/goodCart.png',
    cost: parseInt(cost) + 5.5
  }
]

export const reasons = [
  {
    value: 0,
    name: '行程有变，暂时不需要用车',
    checked: false
  }, {
    value: 1,
    name: '赶时间，换用其它交通工具',
    checked: false
  }, {
    value: 2,
    name: '平台派单太远',
    checked: false
  }, {
    value: 3,
    name: '司机以各种理由不来接我',
    checked: false
  }, {
    value: 4,
    name: '联系不上司机',
    checked: false
  }, {
    value: 5,
    name: '我找不到终点',
    checked: false
  }
]

export const moreResons = [
  {
    value: 6,
    name: '司机未在规定的时间到达站点',
    checked: false
  }, {
    value: 7,
    name: '司机找不到上车地点',
    checked: false
  }, {
    value: 8,
    name: '司机要求加价或现金交易',
    checked: false
  },
  {
    value: 9,
    name: '司机服务态度恶劣',
    checked: false
  },
  {
    value: 10,
    name: '不是订单显示车辆或司机',
    checked: false
  },
  {
    value: 11,
    name: '其他',
    checked: false
  }
]

