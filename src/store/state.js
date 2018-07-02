const state = {
  curNavIndex: 0, //当前头部导航索引
  phone: '',  //登录号码
  curCity: '',//当前所在的城市
  startPlace: '出发地', //出发地
  startFormattedPlace: '', //更具人性化的描述的出发地
  startPosition: [],//包含startLatitude和startLongitude
  destination: '你要去哪儿', //目的地
  endPosition: [], //包含endLatitude和endLongitude
  driver: {}, //司机信息 包含Cartnumber:"赣A66666"cart: "红色●路虎Q5" id: "1" name: "李师傅" stars: "5.0 2w+单"
  cost: 0 //花费
}


export default state
