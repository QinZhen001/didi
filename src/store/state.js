const state = {
  curNavIndex: 0,
  phone: '',
  curCity: '',//当前所在的城市，精确到市级
  startPlace: '出发地', //出发地
  startFormattedPlace: '', //更具人性化的描述的出发地
  startPosition: [],//包含startLatitude和startLongitude
  destination: '', //目的地
  endPosition: [] //包含endLatitude和endLongitude
}


export default state
