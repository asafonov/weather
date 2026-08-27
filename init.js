document.addEventListener("DOMContentLoaded", function (event) {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  window.asafonov.userId = tg.initDataUnsafe?.user?.id
  const view = new ControlView()
})
