const fs = require('fs')
const { join } = require('path')
const net = require('node:net')
const utils = require('./utils')

const log = utils.log(['[CLIENT]'])

const clientVersion = JSON.parse(
  fs.readFileSync(join(__dirname, '..', 'package.json'), { encoding: 'utf-8' })
).version;

log('NodeJS Chat v.', clientVersion);

const socket = net.connect(4555);


socket.on('data', (data) => {
  log('server sent ', data.toString())
});

socket.on('error', (error) => {
  console.error('Connection not established: ', error.code)
});

const CLIENT_LOGIN_INFO = {
  name: process.env.NAME,
  command: 'JOIN'
}
socket.write(JSON.stringify(CLIENT_LOGIN_INFO))



