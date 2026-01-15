class NavigationView {
 
  constructor (container) {
    const navigationContainer = container.querySelector('.navigation')
    this.addButton = navigationContainer.querySelector('.icon_add')
    this.listButton = navigationContainer.querySelector('.icon_list')
    this.pagesButtons = navigationContainer.querySelector('.pages')
    this.menuContainer = navigationContainer.querySelector('.settings_list')
    this.deleteCityButton = this.menuContainer.querySelector('.delete_city')
    this.useSystemButton = this.menuContainer.querySelector('.use_system')
    this.useImperialSystem = !! asafonov.cache.getItem('useImperialSystem')
    this.updateUseSystemButtonTitle()
    this.onAddClickProxy = this.onAddClick.bind(this)
    this.onListClickProxy = this.onListClick.bind(this)
    this.deleteCityProxy = this.deleteCity.bind(this)
    this.useSystemProxy = this.useSystem.bind(this)
    this.addEventListeners()
    this.updatePagesButtons()
  }

  updateUseSystemButtonTitle() {
    this.useSystemButton.innerHTML = this.useImperialSystem ? 'Use metric system' : 'Use imperial system'
  }

  updatePagesButtons (selected) {
    const cities = asafonov.cache.getItem('cities')
    const city = selected || asafonov.cache.getItem('city')

    this.deleteCityButton.style.display = cities && cities.length > 0 ? 'flex' : 'none'

    if (cities && cities.length > 1) {
      this.pagesButtons.style.opacity = 1
      this.pagesButtons.innerHTML = ''

      for (let i = 0; i < cities.length; ++i) {
        const div = document.createElement('div')
        div.className = 'icon_wrap icon_small icon_pages'

        if (i === city) div.id = 'selected_page'

        div.innerHTML = '<svg><use xlink:href="#pages"/></svg>'
        div.addEventListener('click', () => this.selectCity(i))
        this.pagesButtons.appendChild(div)
      }
    } else {
      this.pagesButtons.style.opacity = 0
    }
  }

  selectCity (index) {
    asafonov.messageBus.send(asafonov.events.CITY_SELECTED, {index})
    const pages = this.pagesButtons.querySelectorAll('.icon_pages')

    for (let i = 0; i < pages.length; ++i) {
      if (i === index) {
        pages[i].id = 'selected_page'
      } else {
        pages[i].removeAttribute('id')
      }
    }
  }

  async onAddClick() {
    let city = prompt('Please enter the city in English')

    if (city) {
      city = city.toLowerCase()
      const model = new Forecast(city)
      const data = await model.getData()

      if (data) {
        const cities = asafonov.cache.getItem('cities') || []

        if (cities.indexOf(city) === -1) {
          cities.push(city)
          asafonov.messageBus.send(asafonov.events.CITY_ADDED, {city})
          asafonov.cache.set('cities', cities)
          this.updatePagesButtons()
        }
      }

      model.destroy()
    }
  }

  onListClick() {
    this.menuContainer.style.display = 'flex'
  }

  useSystem() {
    this.menuContainer.style.display = 'none'
    this.useImperialSystem = ! this.useImperialSystem
    this.updateUseSystemButtonTitle()

    if (this.useImperialSystem) {
      asafonov.cache.set('useImperialSystem', '1')
    } else {
      asafonov.cache.remove('useImperialSystem')
    }

    asafonov.messageBus.send(asafonov.events.USE_SYSTEM_UPDATED)
  }

  deleteCity() {
    this.menuContainer.style.display = 'none'

    if (confirm('Are you sure you want to delete current city?')) {
      const cities = asafonov.cache.getItem('cities')
      const city = asafonov.cache.getItem('city')
      const model = new Forecast(cities[city])
      model.deleteCachedData()
      model.destroy()
      cities.splice(city, 1)
      asafonov.cache.remove('city')

      if (cities.length > 0) {
        asafonov.cache.set('cities', cities)
      } else {
        asafonov.cache.remove('cities')
      }

      this.updatePagesButtons(cities.length -1)
      asafonov.messageBus.send(asafonov.events.CITY_REMOVED, {index: city})
    }
  }

  addEventListeners() {
    this.addButton.addEventListener('click', this.onAddClickProxy)
    this.listButton.addEventListener('click', this.onListClickProxy)
    this.deleteCityButton.addEventListener('click', this.deleteCityProxy)
    this.useSystemButton.addEventListener('click', this.useSystemProxy)
  }

  removeEventListeners() {
    this.addButton.removeEventListener('click', this.onAddClickProxy)
    this.listButton.removeEventListener('click', this.onListClickProxy)
    this.deleteCityButton.removeEventListener('click', this.deleteCityProxy)
    this.useSystemButton.removeEventListener('click', this.useSystemProxy)
  }

  destroy() {
    this.removeEventListeners()
    this.addButton = null
    this.pagesButtons.innerHTML = ''
    this.pagesButtons = null
  }

}
