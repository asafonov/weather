class NavigationView {
 
  constructor() {
    const navigationContainer = document.querySelector('.navigation')
    this.addButton = navigationContainer.querySelector('.icon_add')
    this.listButton = navigationContainer.querySelector('.icon_list')
    this.pagesButtons = navigationContainer.querySelector('.pages')
    this.onAddClickProxy = this.onAddClick.bind(this)
    this.onListClickProxy = this.onListClick.bind(this)
    this.addEventListeners()
    this.updatePagesButtons()
  }

  updatePagesButtons (selected) {
    const cities = asafonov.cache.getItem('cities')
    const city = selected || asafonov.cache.getItem('city')

    if (cities && cities.length > 1) {
      this.pagesButtons.style.opacity = 1
      this.pagesButtons.innerHTML = ''

      for (let i = 0; i < cities.length; ++i) {
        const div = document.createElement('div')
        div.className = 'icon icon_small'
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
    const pages = this.pagesButtons.querySelectorAll('.icon')

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
  }

  addEventListeners() {
    this.addButton.addEventListener('click', this.onAddClickProxy)
    this.listButton.addEventListener('click', this.onListClickProxy)
  }

  removeEventListeners() {
    this.addButton.removeEventListener('click', this.onAddClickProxy)
    this.listButton.removeEventListener('click', this.onListClickProxy)
  }

  destroy() {
    this.removeEventListeners()
    this.addButton = null
    this.pagesButtons.innerHTML = ''
    this.pagesButtons = null
  }

}
