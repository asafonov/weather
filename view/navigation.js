class NavigationView {
 
  constructor() {
    const navigationContainer = document.querySelector('.navigation')
    this.addButton = navigationContainer.querySelector('.icon_add')
    this.onAddClickProxy = this.onAddClick.bind(this)
    this.addEventListeners()
  }

  async onAddClick() {
    let city = prompt('Please enter the city in English')

    if (city) {
      city = city.toLowerCase()
      const model = new Forecast(city)
      const data = await model.getData()

      if (data) {
        const cities = asafonov.cache.getItem('cities') || []
        if (cities.indexOf(city) === -1) {
          cities.push(city)
          asafonov.messageBus.send(asafonov.events.CITY_ADDED, {city})
          asafonov.cache.set('cities', cities)
        }
      }

      model.destroy()
    }
  }

  addEventListeners() {
    this.addButton.addEventListener('click', this.onAddClickProxy)
  }

  removeEventListeners() {
    this.addButton.removeEventListener('click', this.onAddClickProxy)
  }

  destroy() {
    this.removeEventListeners()
    this.addButton = null
  }

}
