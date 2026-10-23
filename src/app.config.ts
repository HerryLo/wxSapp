export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/forecast/forecast',
    'pages/detail/detail',
    'pages/test/test'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#e8edf7',
    navigationBarTitleText: '垃圾分类助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#7c88a6',
    selectedColor: '#4f7cff',
    backgroundColor: '#e8edf7',
    list: [
      {
        text: '首页',
        iconPath: 'static/image/outline_home_black_18.png',
        selectedIconPath: 'static/image/round_home_black_18.png',
        pagePath: 'pages/index/index'
      },
      {
        text: '测验',
        iconPath: 'static/image/outline_visibility_black_18.png',
        selectedIconPath: 'static/image/round_visibility_black_18.png',
        pagePath: 'pages/test/test'
      },
      {
        text: '预报',
        iconPath: 'static/image/outline_cloud_black_18.png',
        selectedIconPath: 'static/image/round_cloud_black_18.png',
        pagePath: 'pages/forecast/forecast'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '允许智吱声访问您当前的地理位置信息？'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
