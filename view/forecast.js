class ForecastView {

  constructor (place) {
    this.model = new Forecast(place)
  }

  getIconByData (data) {
    const icons = []
    icons.push(data.clouds > 75 ? 'cloud' : data.hour >= '20' || data.hour <= '08' ? 'moon' : 'sun')

    if (data.clouds >= 25 && data.clouds <= 75) icons.push('cloud')
    if (data.rain) icons.push('rain')
    if (data.wind_speed > 8) icons.push('wind')
    if (icons.length > 1 && icons[0] === 'cloud') icons[0] = 'cloud_with'

    return icons
  }

  getIcon (icons) {
    let ret = `<svg ${icons.length > 1 ? 'class="icon_with"' : ''}><use xlink:href="#${icons[0]}" /></svg>`
    if (icons.length > 1) ret += `<svg class="icon_dop"><use xlink:href="#${icons[1]}" /></svg>`
    if (icons.length > 2) ret += `<svg class="icon_dop dop_second dop_duo"><use xlink:href="#${icons[2]}" /></svg>`
    return ret
  }

  async display() {
    document.querySelector('.city_name').innerHTML = this.model.getPlace()
    const data = await this.model.getData()

    if (! data) return

    document.querySelector('.temperature .now').innerHTML = `${data.now.temp}°`
    document.querySelector('.temperature .max').innerHTML = `${data.now.max}°`
    document.querySelector('.temperature .min').innerHTML = `${data.now.min}°`
    document.querySelector('.city_time').innerHTML = data.now.time
    const icons = this.getIconByData(data.now)
    document.querySelector('.icon_weather').innerHTML = this.getIcon(icons)

    const hourlyDiv = document.querySelector('.scroll_line')
    hourlyDiv.innerHTML = ''

    for (let i = 0; i < data.hourly.length; ++i) {
      hourlyDiv.innerHTML +=
        `<div class="item_scroll_line flex_col centered">
          <div class="text_accent">${data.hourly[i].hour}</div>
          <div class="icon icon_weather icon_normal">
            ${this.getIcon(this.getIconByData(data.hourly[i]))}
          </div>
          <div class="text_h3">${data.hourly[i].temp}°</div>
        </div>`
    }
  }

  destroy() {
    this.model.destroy()
    this.model = null
  }
}
