class ForecastView {

  constructor (place, container) {
    this.container = container
    this.model = new Forecast(place)
  }

  getPrecipIcons (value, iconNames) {
    const ret = []
    const values = [0, 0.25, 2.5, 8]

    for (let i = 0; i < values.length; ++i) {
      if (value > values[i]) ret.push(iconNames[i % iconNames.length])
    }

    return ret
  }

  getIconByData (data) {
    const icons = {main: []}

    if (data.rain && data.snow) {
      icons.main.push('cloud')
      const precipVariants = data.rain > data.snow ? ['raindrop', 'snowflake'] : ['snowflake', 'raindrop']
      icons.precip = this.getPrecipIcons(data.rain + data.snow, precipVariants)
    } else if (data.rain || data.snow) {
      icons.main.push('cloud')
      icons.precip = this.getPrecipIcons(data.rain, ['raindrop']).concat(this.getPrecipIcons(data.snow, ['snowflake']))

      return icons
    }

    icons.main.push(data.clouds > 75 ? 'cloudy' : data.hour >= '20' || data.hour < '08' ? 'moon' : 'sun')
    if (data.clouds >= 25 && data.clouds <= 75) icons.main.push('cloudy')
    if (data.wind_speed > 8) icons.main.push('wind')

    return icons
  }

  getIcon (icons) {
    let ret = ''

    if (icons.precip && icons.precip.length > 0) {
      ret += `<div class="icon_main"><svg><use xlink:href="#${icons.main[0]}"/></svg></div><div class="icon_precip">`

      for (let i = 0; i < icons.precip.length; ++i) {
        ret += `<svg><use xlink:href="#${icons.precip[i]}"/></svg>`
      }

      ret += '</div>'

      return [ret, ['icon_with_precip']]
    }

    for (let i = 0; i < icons.main.length; ++i) {
      ret += `<div class="icon_wrap"><svg><use xlink:href="#${icons.main[i]}"/></svg></div>`
    }

    const classes = []
    icons.main.length === 2 && classes.push('icon_double')
    icons.main.length === 3 && classes.push('icon_tripple')

    return [ret, classes]
  }

  getDayName (day) {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return dayNames[day - 1]
  }

  async display() {
    this.container.querySelector('.city_name').innerHTML = this.model.getPlace()
    this.displayData(this.model.getCachedData())
    const data = await this.model.getData()
    this.displayData(data)
  }

  getCurrentTime (timezone) {
    return new Date(new Date().getTime() + (timezone || 0) * 1000).toISOString().substr(11, 5)
  }

  displayData (data) {
    if (! data) return

    this.container.querySelector('.temperature .now').innerHTML = `${data.now.temp}°`
    this.container.querySelector('.temperature .max').innerHTML = `${data.now.max}°`
    this.container.querySelector('.temperature .min').innerHTML = `${data.now.min}°`
    this.container.querySelector('.wind .wind_speed').innerHTML = data.now.wind_speed
    this.container.querySelector('.wind .wind_direction').innerHTML = data.now.wind_direction
    this.container.querySelector('.city_time').innerHTML = this.getCurrentTime(data.now.timezone)
    this.container.querySelector('.city_stats .description').innerHTML = data.now.description
    const icons = this.getIconByData(data.now)
    const iconDiv = this.container.querySelector('.icon_big')
    const [html, classes] = this.getIcon(icons)
    iconDiv.innerHTML = html
    classes.map(i => iconDiv.classList.add(i))

    const hourlyDiv = this.container.querySelector('.scroll_line')
    hourlyDiv.innerHTML = ''

    for (let i = 0; i < data.hourly.length; ++i) {
      const [html, classes] = this.getIcon(this.getIconByData(data.hourly[i]))
      hourlyDiv.innerHTML +=
        `<div class="item_scroll_line flex_col centered">
          <div class="text_accent">${data.hourly[i].hour}</div>
          <div class="icon_wrap icon_normal icon_scroll_line ${classes.join(' ')}">
            ${html}
          </div>
          <div class="text_h3">${data.hourly[i].temp}°</div>
        </div>`
    }

    const dailyDiv = this.container.querySelector('.days_list')

    dailyDiv.innerHTML = ''

    for (let i = 0; i < data.daily.length; ++i) {
      if (data.daily[i].evening === undefined || data.daily[i].evening === null) break

      const [html, classes] = this.getIcon(this.getIconByData(data.daily[i]))
      dailyDiv.innerHTML +=
        `<div class="item_days_list flex_row centered">
          <div class="day_name">${i === 0 ? 'Tomorrow' : this.getDayName(data.daily[i].day)}</div>
          <div class="right_part flex_row centered">
            <div class="icon_wrap icon_normal ${classes.join(' ')}">
              ${html}
            </div>
            <div class="temperature flex_row">
              <div class="text_accent">${data.daily[i].morning}°</div>
              <div class="icon_wrap icon_small icon_opact">
                <svg>
                  <use xlink:href="#sun_up"/>
                </svg>
              </div>
              <div class="text_h3">${data.daily[i].temp}°</div>
              <div class="icon_wrap icon_small icon_opact">
                <svg>
                  <use xlink:href="#sun_down"/>
                </svg>
              </div>
              <div class="text_accent">${data.daily[i].evening}°</div>
            </div>
            <div class="wind flex_row centered">
              <div class="power">${data.daily[i].wind_speed}</div>
              <div class="direction flex_col centered">
                <div class="icon_wrap icon_fill icon_compas compas_se">
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
    this.container = null
    this.model.destroy()
    this.model = null
  }
}
