/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-31 10:00:08
 * @Description 该模块用于用户业务，即增删查改用户数据，但不做持久化存储，并对C端提供REST服务
 */
'use strict'

const vastify = require('vastify')
const vast = vastify.getInstance()
const { VastifyWebModule } = vast.web
const UserModel = require('../models/user')
const $module = 'module:user'

const routes = [
  {
    prefix: '/user',
    pin: `${$module},if:*`,
    map: {
      list: {
        GET: true,
        name: ''
      },
      load: {
        GET: true,
        name: '',
        suffix: '/:id'
      },
      edit: {
        PUT: true,
        name: '',
        suffix: '/:id'
      },
      create: {
        POST: true,
        name: ''
      },
      delete: {
        DELETE: true,
        name: '',
        suffix: '/:id'
      }
    }
  }
]

// user模块插件
function plugin() {
  // seneca会一直等待直到init:plugin的action执行完毕，即调用done()方法后才会继续执行，也就是说plugin的定义顺序是有意义的
  this.add('init:plugin', (msg, done) => {
    setTimeout(() => {
      console.log('One seconds later...user module init completed')
      done()
    }, 1000)
  })
  this.add(`${$module},if:list`, (msg, done) => {
    UserModel.find({}, '-_id id name', (err, arr) => {
      done(null, arr)
    })
  })
  this.add(`${$module},if:load`, (msg, done) => {
    let { id } = msg.args.params
    id = +id
    this.log.info(this.fixedargs['tx$'])
    UserModel.find({
      id
    }, '-_id id name', (err, arr) => {
      if (err) return done(err, null)
      done(null, arr)
    })
  })
  this.add(`${$module},if:edit`, (msg, done) => {
    let { id } = msg.args.params
    id = +id
    const { name } = msg.args.body
    UserModel.findOneAndUpdate({
      id
    }, {
      name
    }, null, (err, res) => {
      if (err) return done(null, { success: false })
      if (res) {
        done(null, { success: true, id })
      } else {
        done(null, { success: false, id })
      }
    })
  })
  this.add(`${$module},if:create`, (msg, done) => {
    const { name } = msg.args.body
    UserModel.count((err, count) => {
      UserModel.create({
        id: count + 1,
        name
      }, (err, result) => {
        if (err) return done(null, { success: false })
        done(null, { success: true })
      })
    })
  })
  this.add(`${$module},if:delete`, (msg, done) => {
    let { id } = msg.args.params
    id = +id
    UserModel.findOneAndRemove({
      id
    }, (err, res) => {
      if (err) return done(null, { success: false })
      done(null, { success: true })
    })
  })
}

module.exports = new VastifyWebModule({
  plugin,
  routes
})