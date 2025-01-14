class Forecast {

  constructor (place) {
    const capitalize = v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    this.place = place.split(' ').map(i => capitalize(i)).join(' ')
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
      snow: item.snow,
      description: item.description
    }
  }

  deleteCachedData() {
    asafonov.cache.remove(this.place)
  }

  getCachedData() {
    return asafonov.cache.getItem(this.place)
  }

  async getData() {
    let data = asafonov.cache.get(this.place)

    if (! data) {
      data = {hourly: [], daily: []}
      const url = `${asafonov.settings.apiUrl}/?place=${this.place}`
      try {
        const apiResp = await (await fetch(url)).json()
        const date = apiResp[0].date.substr(0, 10)
        let maxToday = apiResp[0].temp
        let minToday = apiResp[0].temp
        let prevDate = date

        for (let i = 1; i < apiResp.length; ++i) {
          let d = apiResp[i].date.substr(0, 10)
          let h = apiResp[i].date.substr(11, 2)

          if (d !== prevDate) {
            if (data.daily.length > 0) {
              const index = data.daily.length - 1
              if (data.daily[index].rain < 0.5) data.daily[index].rain = 0
              if (data.daily[index].snow < 0.5) data.daily[index].snow = 0
            }

            data.daily.push({rain: 0, snow: 0, clouds: 0, wind_speed: 0, day: apiResp[i].day, date: apiResp[i].date})
            prevDate = d
          }

          if (d === date) {
            maxToday = Math.max(apiResp[i].temp, maxToday)
            minToday = Math.min(apiResp[i].temp, minToday)
          } else {
            const index = data.daily.length - 1
            data.daily[index].rain = Math.max(apiResp[i].rain || 0, data.daily[index].rain)
            data.daily[index].snow = Math.max(apiResp[i].snow || 0, data.daily[index].snow)
            data.daily[index].wind_speed = Math.max(apiResp[i].wind_speed || 0, data.daily[index].wind_speed)
            data.daily[index].clouds += (apiResp[i].clouds || 0) / 8

            if (h >= '00' && h <= '08') {
              data.daily[index].morning = data.daily[index].morning !== undefined ? Math.min(data.daily[index].morning, apiResp[i].temp) : apiResp[i].temp
            }

            if (h > '08' && h <= '20') {
              data.daily[index].temp = data.daily[index].temp !== undefined ? Math.max(data.daily[index].temp, apiResp[i].temp) : apiResp[i].temp
              data.daily[index].wind_direction = apiResp[i].wind_direction
            }

            if (h > '20') {
              data.daily[index].evening = data.daily[index].evening !== undefined ? Math.min(data.daily[index].evening, apiResp[i].temp) : apiResp[i].temp
            }
          }

          if (i <= 16) {
            data.hourly.push(this.formatData(apiResp[i]))
          }
        }

        data.now = {
          ...this.formatData(apiResp[0]), ...{max: maxToday, min: minToday, timezone: apiResp[0].timezone}
        }

        asafonov.cache.set(this.getPlace(), data)
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
