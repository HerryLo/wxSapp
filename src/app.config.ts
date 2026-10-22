export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/forecast/forecast',
    'pages/detail/detail',
    'pages/test/test'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#eee',
    selectedColor: '#49a9ee',
    backgroundColor: '#ffffff',
    list: [
      {
        text: '分类',
        iconPath: 'static/image/outline_home_black_18.png',
        selectedIconPath: 'static/image/round_home_black_18.png',
        pagePath: 'pages/index/index'
      },
      {
        text: '测试',
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
