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

  formatData (item) {
    return {
      temp: item.temp,
      time: item.date.substr(11),
      hour: item.date.substr(11, 2),
      day: item.date.substr(8, 2),
      wind_speed: item.wind_speed,
      wind_direction: item.wind_direction,
      pressure: item.pressure,
      humidity: item.humidity,
      clouds: item.clouds,
      rain: item.rain,
      snow: item.snow
    }
  }

  async getData() {
    let data = asafonov.cache.get(this.place)

    if (! data) {
      data = {hourly: []}
      const url = `${asafonov.settings.apiUrl}/?place=${this.place}`
      try {
        const apiResp = await (await fetch(url)).json()
        const date = apiResp[0].date.substr(0, 10)
        let maxToday = apiResp[0].temp
        let minToday = apiResp[0].temp

        for (let i = 1; i < apiResp.length; ++i) {
          let d = apiResp[i].date.substr(0, 10)
          let h = apiResp[i].date.substr(12, 2)

          if (d === date) {
            maxToday = Math.max(apiResp[i].temp, maxToday)
            minToday = Math.min(apiResp[i].temp, minToday)
          }

          if (i <= 16) {
            data.hourly.push(this.formatData(apiResp[i]))
          }
        }

        data.now = {
          ...this.formatData(apiResp[0]), ...{max: maxToday, min: minToday}
        }

        console.log(data)
      } catch (e) {
        console.error(e)
        return
      }
    }

    return data
  }

  destroy() {
    this.place = null
  }

}
