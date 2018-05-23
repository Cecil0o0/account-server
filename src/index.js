/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-23 20:53:14
 * @Description 用户服务入口文件
 */

'use strict'
const { Vast } = require('vastify')
const vast = new Vast()
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