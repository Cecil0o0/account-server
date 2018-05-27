/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-27 18:32:44
 * @Description 用户服务入口文件
 */

'use strict'
const vastify = require('vastify')
const vast = vastify.getIntance({
  db: {
    address: 'mongodb://localhost:27017'
  }
})
const { seneca, web } = vast
const app = web.app
const userModule = require('./modules/user')

// 设置远程服务调用规则
seneca.client({
  port: 10011,
  pin: '$$target:config-server'
})

// 对seneca.user封装以适应于对C端提供REST接口的服务
seneca.useREST(userModule)

// 将routes导出给koa app
seneca.ready(() => {
  app.use(seneca.export('web/context')().routes())
}).listen(10015)

app.listen(3333)