window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.cache = new Cache(600000)
window.asafonov.events = {
  CITY_ADDED: 'CITY_ADDED',
  CITY_SELECTED: 'CITY_SELECTED'
}
window.asafonov.settings = {
  apiUrl: 'http://isengard.asafonov.org/api/v1/weather/',
  defaultCity: 'Belgrade'
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
