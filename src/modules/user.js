/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-22 20:24:31
 * @Description 该模块用于用户业务，即增删查改用户数据，但不做持久化存储，并对C端提供REST服务
 */
'use strict'

const $module = 'module:user'
let userCount = 3

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

const db = {
  orgs: [
    {
      id: 1,
      users: [1, 2]
    },
    {
      id: 2,
      users: [3]
    }
  ],
  users: [{
    id: 1,
    name: '甲'
  }, {
    id: 2,
    name: '乙'
  }, {
    id: 3,
    name: '丙'
  }]
}

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
    done(null, db.users)
  })
  this.add(`${$module},if:load`, (msg, done) => {
    const { id } = msg.args.params
    this.log.info(this.fixedargs['tx$'])
    done(null, db.users.find(v => Number(id) === v.id))
  })
  this.add(`${$module},if:edit`, (msg, done) => {
    let { id } = msg.args.params
    id = +id
    const { name } = msg.args.body
    const index = db.users.findIndex(v => v.id === id)
    if (index !== -1) {
      db.users.splice(index, 1, {
        id,
        name
      })
      done(null, db.users)
    } else {
      done(null, { success: false })
    }
  })
  this.add(`${$module},if:create`, (msg, done) => {
    const { name } = msg.args.body
    db.users.push({
      id: ++userCount,
      name
    })
    done(null, db.users)
  })
  this.add(`${$module},if:delete`, (msg, done) => {
    let { id } = msg.args.params
    id = +id
    const index = db.users.findIndex(v => v.id === id)
    if (index !== -1) {
      db.users.splice(index, 1)
      done(null, db.users)
    } else {
      done(null, { success: false })
    }
  })
}

module.exports = {
  plugin,
  routes
}