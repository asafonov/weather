class ControlView {
  constructor() {
    this.addEventListeners()
    this.container = document.querySelector('#forecast')
    this.navigationView = new NavigationView(this.container)
    this.forecastViews = []
    const cities = asafonov.cache.getItem('cities')

    if (cities && cities.length > 0) {
      for (let i = 0; i < cities.length; ++i) {
        this.forecastViews.push(new ForecastView(cities[i], this.container))
      }

      this.displayForecast()
    } else {
      this.defaultForecastView = new ForecastView(asafonov.settings.defaultCity, this.container)
      this.defaultForecastView.display()
    }
  }

  getCurrentCityIndex() {
    let index = asafonov.cache.getItem('city')

    if (index === null || index ===undefined || index > this.forecastViews.length - 1) index = this.forecastViews.length - 1

    return index
  }

  displayForecast (index) {
    if (index === null || index === undefined) {
      index = this.getCurrentCityIndex()
    }

    if (index > -1) {
      asafonov.cache.set('city', index)
      this.forecastViews[index].display()
    }
  }

  addEventListeners() {
    asafonov.messageBus.subscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
    asafonov.messageBus.subscribe(asafonov.events.CITY_SELECTED, this, 'onCitySelected')
    asafonov.messageBus.subscribe(asafonov.events.CITY_REMOVED, this, 'onCityRemoved')
    asafonov.messageBus.subscribe(asafonov.events.USE_SYSTEM_UPDATED, this, 'onUseSystemUpdated')
  }

  removeEventListeners() {
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_ADDED, this, 'onCityAdded')
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_SELECTED, this, 'onCitySelected')
    asafonov.messageBus.unsubscribe(asafonov.events.CITY_REMOVED, this, 'onCityRemoved')
    asafonov.messageBus.unsubscribe(asafonov.events.USE_SYSTEM_UPDATED, this, 'onUseSystemUpdated')
  }

  onUseSystemUpdated() {
    const index = this.getCurrentCityIndex()

    if (index > -1)
      this.displayForecast(index)
    else if (this.defaultForecastView)
      this.defaultForecastView.display()
  }

  onCityAdded ({city}) {
    this.forecastViews.push(new ForecastView(city, this.container))
    this.displayForecast(this.forecastViews.length - 1)
  }

  onCitySelected ({index}) {
    this.displayForecast(index)
  }

  onCityRemoved({index}) {
    this.forecastViews[index].destroy()
    this.forecastViews[index] = null
    this.forecastViews.splice(index, 1)
    this.displayForecast()
  }

  destroy() {
    for (let i = 0; i < this.forecastViews.length; ++i) {
      this.forecastViews[i].destroy()
      this.forecastViews[i] = null
    }

    this.forecastViews = null
    this.navigationView.destroy()
    this.navigationView = null
    this.defaultForecastView = null
    this.removeEventListeners()
  }
}
