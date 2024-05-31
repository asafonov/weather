class ControlView {
  constructor() {
    this.addEventListeners()
    this.navigationView = new NavigationView()
    this.forecastViews = []
    const cities = asafonov.cache.getItem('cities') || ['Belgrade']

    for (let i = 0; i < cities.length; ++i) {
      this.forecastViews.push(new ForecastView(cities[i]))
    }

    this.forecastViews[this.forecastViews.length - 1].display()
  }

  addEventListeners() {
    asafonov.messageBus.subscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
  }

  removeEventListeners() {
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
  }

  onCityAdded ({city}) {
    const view = new ForecastView(city)
    view.display()
    this.forecastViews.push(view)
  }

  destroy() {
    for (let i = 0; i < this.forecastViews.length; ++i) {
      this.forecastViews[i].destroy()
      this.forecastViews[i] = null
    }

    this.forecastViews = null
    this.navigationView.destroy()
    this.navigationView = null
    this.removeEventListeners()
  }
}
