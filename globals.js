window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.events = {
}
window.asafonov.settings = {
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
