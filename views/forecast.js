class ForecastView {
  constructor (place) {
    this.model = new Forecast(place)
  }

  display() {
  }

  destroy() {
    this.model.destroy()
    this.model = null
  }
}
