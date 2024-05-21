class Forecast {

  constructor (place) {
    if (place) {
      this.place = place.charAt(0).toUpperCase() + place.slice(1).toLowerCase()
    } else {
      this.place = 'Belgrade'
    }
  }

  getPlace() {
    return this.place
  }

  async getData() {
    let data = asafonov.cache.get(place)

    if (! data) {
      const url = `${asafonov.settings.apiUrl}/?place=${place}`
      apiResp = await fetch(url)

      data = {
        now: {
          temp: apiResp[0].temp
        }
      }
    }

    return data
  }

  destroy() {
    this.place = null
  }

}
