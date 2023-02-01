const EventEmitter = require('node:events')
const utils = require('../utils')
const log = utils.log(['[MESSAGES-DISPATCHERS]'])

log('Messages-Dispatchers instantied')

class MessageHandler extends EventEmitter {
  constructor() {
    super()
  }

  handle(event, data) {
    switch (event) {
      case 'data':
        log(`Event: ${event}, data: ${data}`)
        const { command, payload } = JSON.parse(data)
        if (command === 'JOIN') {
          log('JOIN')
          // contact presence service to check availability
          // store client data and add to the pool
          // notify clients
        } else if (command === 'QUIT') {
          log('QUIT')
          // delete client data and remove from pool
          // notify clients
        } else if (command === 'MESSAGE') {
          log('MESSAGE')
          // send message to all clients in pool
        }
        break;
      case 'close':
        log(`Event: ${event}`)
        break
      default:
        log(`Unknown ${event} event`)
    }
  }
}

module.exports = MessageHandler
