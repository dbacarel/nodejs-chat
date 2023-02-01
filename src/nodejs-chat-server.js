const net = require('node:net')
const utils = require('./utils')
const MessageHandler = require('./services/message-handler')
const log = utils.log(['[SERVER]'])

const messageDispatcher = new MessageHandler()

const server = net.createServer((clientSocket) => {
  log('New client connected')
  clientSocket.on('data', (data) => {
    messageDispatcher.handle('data', data)
  })
  clientSocket.on('close', () => {
    messageDispatcher.handle('close')
  })
});

server.listen(4555, () => {
  log('server listening on port 4555')
})
