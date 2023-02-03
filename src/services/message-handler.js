const EventEmitter = require('node:events')
const PresenceService = require('./presence-service')
const { DuplicateUserError } = require('./../errors')
const utils = require('../utils')
const log = utils.log(['[MESSAGES-DISPATCHERS]'])



class MessageHandler extends EventEmitter {
  constructor() {
    super()
    log('instantied')
    this.presenceService = new PresenceService(this)

    this.presenceService.on('duplicate-user', (socket) => {
      socket.write('Nah, name is already taken. Bye you.')
      socket.destroy()
    })

    this.presenceService.on('new-user', (args) => {
      const sockets = args[0]
      const username = args[1]
      sockets.forEach(socket => {
        socket.write(`A new cool kid is in town, greet: ${username}`)
      })
    })

    this.presenceService.on('user-quit', (args) => {
      const sockets = args[0]
      const username = args[1]
      sockets.forEach(socket => {
        socket.write(`${username} left the town.`)
      })
    })

    this.presenceService.on('user-sent-message', (args) => {
      const sockets = args[0]
      const username = args[1]
      const message = args[2]
      sockets.forEach(socket => {
        socket.write(`${username}: ${message}`)
      })
    })
  }

  handle(event, { socket, data }) {
    switch (event) {
      case 'data':
        log(`Event: ${event}, data: ${data}`)
        const { command, payload } = JSON.parse(data)
        if (command === 'JOIN') {
          log('JOIN')
          this.emit('join', [socket, data])
        } else if (command === 'QUIT') {
          log('QUIT')
          this.emit('quit', [socket])
        } else if (command === 'MESSAGE') {
          log('MESSAGE')
          const messageData = JSON.parse(data.toString()).message.data
          const message = Buffer.from(messageData)
          this.emit('message', [socket, message])
        }
        break;
      case 'close':
        log(`Event: ${event}`)
        this.emit('quit', [socket])
        break
      default:
        log(`Unknown ${event} event`)
    }
  }
}

module.exports = MessageHandler
