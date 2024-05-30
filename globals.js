window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.cache = new Cache(600000)
window.asafonov.events = {
}
window.asafonov.settings = {
  apiUrl: 'http://isengard.asafonov.org/weather/'
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
