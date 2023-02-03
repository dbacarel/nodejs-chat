const EventEmitter = require('node:events')
const utils = require('../utils')
const log = utils.log(['[PRESENCE-SERVICE]'])

class PresenceService extends EventEmitter {
  constructor(messageHandler) {
    super()
    log('Instantiated')
    this.users_ = new Map()
    this.userNames_ = []
    this.messageHandler_ = messageHandler;
    this.messageHandler_.on('join', this.handleJoin_.bind(this))
    this.messageHandler_.on('quit', this.handleQuit_.bind(this))
    this.messageHandler_.on('message', this.handleMessage_.bind(this))
  }

  handleJoin_(args) {
    const socket = args[0]
    const userData = JSON.parse(args[1].toString())

    if (this.users_.has(socket)) {
      throw DuplicateUserError('Socket already exists brah. Bye now')
    }

    if (this.userNames_.indexOf(userData.name) !== -1) {
      this.emit('duplicate-user', socket)
    } else {
      this.users_.set(socket, userData)
      this.userNames_.push(userData.name)
      this.emit('new-user', [Array.from(this.users_.keys()), userData.name])
    }

  }

  handleQuit_(args) {
    const socket = args[0]
    const userData = this.users_.get(socket)
    if (userData) {
      this.userNames_ = this.userNames_.filter(n => n !== userData.name)
      this.users_.delete(socket)
      this.emit('user-quit', [Array.from(this.users_.keys()), userData.name])
    }
  }

  handleMessage_(args) {
    const socket = args[0]
    const userData = this.users_.get(socket)
    const message = args[1]
    if (userData) {
      this.userNames_ = this.userNames_.filter(n => n !== userData.name)
      this.emit('user-sent-message', [Array.from(this.users_.keys()), userData.name, message])
    }
  }
}



module.exports = PresenceService
