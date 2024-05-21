window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.cache = new Cache()
window.asafonov.events = {
}
window.asafonov.settings = {
  apiUrl: 'http://isengard.asafonov.org:8000/weather/'
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
