/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-23 09:25:42
 * @Description 无
 */
'use strict'

const Vastify = require("vastify")
const path = require('path')
const vast = new Vastify({
  pm2: {
    deploy: {
      'post-deploy': 'npm install && pm2 startOrRestart deploy/deploy.config.js --env production'
    }
  }
})
const { 
  GeneratePM2AppConfig,
  GeneratePM2DeployConfig
 } = vast.deployTool
const name = 'account-server'

const processFile = {
  apps: [
    GeneratePM2AppConfig({
      name,
      script: path.join(__dirname, '../src/index.js'),
      error_file: path.join(__dirname, `./log/${name}-err.log`),
      out_file: path.join(__dirname, `./log/${name}-out.log`),
      instances: 1
    })
  ],
  deploy: GeneratePM2DeployConfig()
}

module.exports = processFile
