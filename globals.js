window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.cache = new Cache(600000)
window.asafonov.events = {
  CITY_ADDED: 'CITY_ADDED',
  CITY_SELECTED: 'CITY_SELECTED',
  CITY_REMOVED: 'CITY_REMOVED',
  USE_SYSTEM_UPDATED: 'USE_SYSTEM_UPDATED'
}
window.asafonov.settings = {
  apiUrl: 'https://242203.xyrufkn4ixok.majordomo-hosting.ru/api/v1/weather/',
  defaultCity: 'Moscow'
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
