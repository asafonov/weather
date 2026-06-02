class ControlView {
  constructor() {
    this.addEventListeners()
    this.container = document.querySelector('#forecast')
    this.navigationView = new NavigationView(this.container)
    this.forecastViews = []
    const cities = asafonov.cache.getItem('cities') || []

    if (cities.length > 0) {
      for (let i = 0; i < cities.length; ++i) {
        this.forecastViews.push(new ForecastView(cities[i], this.container))
      }
    } else {
      this.forecastViews.push(new ForecastView(asafonov.settings.defaultCity), this.container)
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          this.forecastViews.push(new ForecastView(null, this.container, lat, lon))
          this.displayForecast(cities.length)
        },
        error => {
          this.displayForecast()
        }
      )
    } else {
      this.displayForecast()
    }

  }

  getCurrentCityIndex() {
    let index = asafonov.cache.getItem('city')

    if (index === null || index ===undefined || index > this.forecastViews.length - 1) index = this.forecastViews.length - 1

    return index
  }

  displayForecast (index) {
    if (index === null || index === undefined) {
      index = this.getCurrentCityIndex() || 0
    }

    asafonov.cache.set('city', index)
    this.forecastViews[index].display()
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
    const index = this.getCurrentCityIndex() || 0
    this.displayForecast(index)
  }

  onCityAdded ({city, cities}) {
    if (cities.length === 1) {
      this.forecastViews[0].destroy()
      this.forecastViews[0] = new  ForecastView(city, this.container)
    } else {
      this.forecastViews.push(new ForecastView(city, this.container))
    }

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
    this.removeEventListeners()
  }
}
