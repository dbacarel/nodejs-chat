const log = (prefix) => {
  return (...msg) => {
  if (process.env.DEBUG){
    console.log(prefix, new Date(), ...msg)
  } else {
    console.log(prefix, ...msg);
  }
}
}

module.exports = {log}
