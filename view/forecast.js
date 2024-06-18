class ForecastView {

  constructor (place) {
    this.model = new Forecast(place)
  }

  getIconByData (data) {
    const icons = []
    icons.push(data.clouds > 75 || data.rain || data.snow ? 'cloud' : data.hour >= '20' || data.hour < '08' ? 'moon' : 'sun')

    if (! data.rain && ! data.snow && data.clouds >= 25 && data.clouds <= 75) icons.push('cloud')
    if (data.rain) icons.push('rain')
    if (data.rain > 1) icons.push('rain')
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

  getDayName (day) {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return dayNames[day - 1]
  }

  async display() {
    document.querySelector('.city_name').innerHTML = this.model.getPlace()
    this.displayData(this.model.getCachedData())
    const data = await this.model.getData()
    this.displayData(data)
  }

  getCurrentTime (timezone) {
    return new Date(new Date().getTime() + (timezone || 0) * 1000).toISOString().substr(11, 5)
  }

  displayData (data) {
    if (! data) return

    document.querySelector('.temperature .now').innerHTML = `${data.now.temp}°`
    document.querySelector('.temperature .max').innerHTML = `${data.now.max}°`
    document.querySelector('.temperature .min').innerHTML = `${data.now.min}°`
    document.querySelector('.wind .wind_speed').innerHTML = data.now.wind_speed
    document.querySelector('.wind .wind_direction').innerHTML = data.now.wind_direction
    document.querySelector('.city_time').innerHTML = this.getCurrentTime(data.now.timezone)
    document.querySelector('.city_stats .description').innerHTML = data.now.description
    const icons = this.getIconByData(data.now)
    const iconDiv = document.querySelector('.icon_weather')
    iconDiv.innerHTML = this.getIcon(icons)
    iconDiv.classList[data.now.rain ? 'remove' : 'add']('icon_dop_top')

    const hourlyDiv = document.querySelector('.scroll_line')
    hourlyDiv.innerHTML = ''

    for (let i = 0; i < data.hourly.length; ++i) {
      hourlyDiv.innerHTML +=
        `<div class="item_scroll_line flex_col centered">
          <div class="text_accent">${data.hourly[i].hour}</div>
          <div class="icon icon_weather icon_normal${data.hourly[i].rain ? '' : ' icon_dop_top'}">
            ${this.getIcon(this.getIconByData(data.hourly[i]))}
          </div>
          <div class="text_h3">${data.hourly[i].temp}°</div>
        </div>`
    }

    const dailyDiv = document.querySelector('.days_list')
    dailyDiv.innerHTML = ''

    for (let i = 0; i < data.daily.length; ++i) {
      if (! data.daily[i].evening) break

      dailyDiv.innerHTML +=
        `<div class="item_days_list flex_row centered">
          <div class="day_name">${i === 0 ? 'Tomorrow' : this.getDayName(data.daily[i].day)}</div>
          <div class="right_part flex_row centered">
            <div class="icon icon_weather icon_normal${data.daily[i].rain ? '' : ' icon_dop_top'}">
              ${this.getIcon(this.getIconByData(data.daily[i]))}
            </div>
            <div class="temperature flex_row">
              <div class="text_accent">${data.daily[i].morning}°</div>
              <div class="icon icon_small">
                <svg>
                  <use xlink:href="#sun_up"/>
                </svg>
              </div>
              <div class="text_h3">${data.daily[i].temp}°</div>
              <div class="icon icon_small">
                <svg>
                  <use xlink:href="#sun_down"/>
                </svg>
              </div>
              <div class="text_accent">${data.daily[i].evening}°</div>
            </div>
            <div class="wind flex_row centered">
              <div class="power">${data.daily[i].wind_speed}</div>
              <div class="direction flex_col centered">
                <div class="icon icon_fill icon_compas compas_se">
                  <svg>
                    <use xlink:href="#direction"/>
                  </svg>
                </div>
                <div class="text_small_dop">${data.daily[i].wind_direction}</div>
              </div>
            </div>
          </div>
        </div>`
    }
  }

  destroy() {
    this.model.destroy()
    this.model = null
  }
}
