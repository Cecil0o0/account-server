/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-06-02 16:29:34
 * @Description 用户服务入口文件
 */

// 'use strict'
const vastify = require('vastify')
const version = require('../package.json').version
const microservicePort = 10016
const httpPort = 3334

// 注册服务
vastify.ServerRegister.register({
  bizService: {
    name: 'account-server',
    host: '127.0.0.1',
    port: httpPort,
    meta: {
      $$version: version,
      $$microservicePort: microservicePort
    }
  }
}).then(res => {
  const vast = vastify.getInstance({
    microservice: {
      healthCheckReturn: { version }
    }
  })
  const { seneca, web } = vast
  const app = web.app
  const userModule = require('./modules/user')

  // 路由插件
  seneca.use(vastify.Plugins.Routing)

  // 对seneca.user封装以适应于对C端提供REST接口的服务
  seneca.useREST(userModule)
  
  // 将routes导出给koa app
  seneca.ready(() => {
    app.use(seneca.export('web/context')().routes())
  }).listen(microservicePort)
  
  app.listen(httpPort)

  seneca.act({
    $$target: 'config-server',
    $$version: '1.0.0'
  }, (err, msg) => {
    if (err) return console.log(err)
    console.log(msg)
  })
  
  seneca.act({
    $$target: 'config-server',
    $$version: '2.0.0'
  }, (err, msg) => {
    if (err) return console.log(err)
    console.log(msg)
  })
})