class Cache {
  constructor (ttl) {
    this.ttl = ttl || 3600000
  }
  set (name, value) {
    const ts = new Date().getTime()
    localStorage.setItem(name, {ts, value})
    return value
  }
  get (name) {
    const data = localStorage.getItem(name)
    if (data && data.ts) {
      if (data.ts + this.ttl < new Date().getTime())
        return data.value
      this.remove(name)
    }
    return
  }
  remove (name) {
    localStorage.removeItem(name)
  }
  destroy() {
    this.ttl = null
  }
}
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
class MessageBus {
  constructor() {
    this.subscribers = {};
  }
  send (type, data) {
    if (this.subscribers[type] !== null && this.subscribers[type] !== undefined) {
      for (var i = 0; i < this.subscribers[type].length; ++i) {
        this.subscribers[type][i]['object'][this.subscribers[type][i]['func']](data);
      }
    }
  }
  subscribe (type, object, func) {
    if (this.subscribers[type] === null || this.subscribers[type] === undefined) {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push({
      object: object,
      func: func
    });
  }
  unsubscribe (type, object, func) {
    if (this.subscribers[type] === null || this.subscribers[type] === undefined) return
    for (var i = 0; i < this.subscribers[type].length; ++i) {
      if (this.subscribers[type][i].object === object && this.subscribers[type][i].func === func) {
        this.subscribers[type].slice(i, 1);
        break;
      }
    }
  }
  unsubsribeType (type) {
    delete this.subscribers[type];
  }
  destroy() {
    for (type in this.subscribers) {
      this.unsubsribeType(type);
    }
    this.subscribers = null;
  }
}
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
window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.cache = new Cache()
window.asafonov.events = {
}
window.asafonov.settings = {
  apiUrl: 'http://isengard.asafonov.org:8000/weather/'
}
window.onerror = (msg, url, line) => {
  if (!! window.asafonov.debug) alert(`${msg} on line ${line}`)
}
document.addEventListener("DOMContentLoaded", function (event) {
  const forecast = new ForecastView()
  forecast.display()
})
