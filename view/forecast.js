class ForecastView {
  constructor (place) {
    this.model = new Forecast(place)
    this.cityName = document.querySelector('.city_name')
  }

  display() {
    this.cityName.innerHTML = this.model.getPlace()
  }

  destroy() {
    this.model.destroy()
    this.model = null
    this.cityName = null
  }
}
