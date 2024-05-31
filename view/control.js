class ControlView {
  constructor() {
    this.addEventListeners()
    this.navigationView = new NavigationView()
    this.forecastViews = []
    const cities = asafonov.cache.getItem('cities')

    if (cities && cities.length > 0) {
      for (let i = 0; i < cities.length; ++i) {
        this.forecastViews.push(new ForecastView(cities[i]))
      }

      this.displayForecast()
    } else {
      const forecastView = new ForecastView(asafonov.settings.defaultCity)
      forecastView.display()
    }
  }

  displayForecast (index) {
    if (index === null || index === undefined) {
      index = asafonov.cache.getItem('city')

      if (index === null || index ===undefined || index > this.forecastViews.length - 1) index = this.forecastViews.length - 1
    }

    asafonov.cache.set('city', index)
    this.forecastViews[index].display()
  }

  addEventListeners() {
    asafonov.messageBus.subscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
    asafonov.messageBus.subscribe(asafonov.events.CITY_SELECTED, this, 'onCitySelected')
  }

  removeEventListeners() {
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_SELECTED, this, 'onCitySelected')
  }

  onCityAdded ({city}) {
    this.forecastViews.push(new ForecastView(city))
    this.displayForecast(this.forecastViews.length - 1)
  }

  onCitySelected ({index}) {
    this.displayForecast(index)
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
