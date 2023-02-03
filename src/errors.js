class DuplicateUserError extends Error {
  constructor(msg) {
    super()
    this.code = 'duplicate-user'
    this.message = msg
  }
}

module.exports = {DuplicateUserError}
