const ci = require('miniprogram-ci')
let { wxVersion: version, wxDesc: desc } = require('../package.json').wx

if (!version) version = 'v1.0.0'
if (!desc) desc = new Date() + '上传'

const project = new ci.Project({
  appid: 'wx6a0b834a3839e80d',
  type: 'miniProgram',
  projectPath: process.cwd() + '/dist',
  privateKeyPath: process.cwd() + '/key/private.wx6a0b834a3839e80d.key',
  ignores: ['node_modules/**/*'],
})
ci.upload({
  project,
  version,
  desc,
  setting: {
    minify: true,
  },
}).then(res => {
  console.log(res)
  console.log('上传成功----'+new Date())
}).catch(error => {
  if (error.errCode == -1) {
    console.log('上传成功----'+new Date())
  }
  console.log(error)
  console.log('😭😭😭😭😭😭😭😭提 交 有 错 误😭😭😭😭😭😭😭😭')
  process.exit(-1)
})
