/*
 * @Author: Cecil 
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-05-30 14:44:49
 * @Description 无
 */
'use strict'

const path = require('path')
const { 
  GeneratePM2AppConfig,
  GeneratePM2DeployConfig
 } = require("vastify").getDeployTool()
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
  deploy: {
    production: GeneratePM2DeployConfig({
      user: 'deploy',
      host: 'qingf.me',
      repo: 'https://github.com/Cecil0o0/account-server.git',
      path: '/home/deploy/apps/account-server'
    })
  }
}

module.exports = processFile
