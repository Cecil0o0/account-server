/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-21 22:49:17
 * @Description 无
 */
'use strict'

const Vastify = require("vastify")
const path = require('path')
const vast = new Vastify()
const { deploy } = vast
const name = 'account-server'

const processFile = {
  apps: [
    deploy.GeneratePM2AppConfig({
      name,
      script: path.join(__dirname, '../src/index.js'),
      error_file: path.join(__dirname, `./log/${name}-err.log`),
      out_file: path.join(__dirname, `./log/${name}-out.log`),
      instances: 1
    })
  ]
}

module.exports = processFile
