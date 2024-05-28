class Cache {
  constructor (ttl, prefix) {
    this.prefix = prefix || 'asafonov.org'
    this.ttl = ttl || 3600000
  }

  set (name, value) {
    const ts = new Date().getTime()
    localStorage.setItem(this.prefix + name, JSON.stringify({ts, value}))
    return value
  }

  get (name) {
    const data = JSON.parse(localStorage.getItem(this.prefix + name))

    if (data && data.ts) {
      if (data.ts + this.ttl < new Date().getTime())
        return data.value
    }

    return
  }

  getItem (name) {
    const data = JSON.parse(localStorage.getItem(this.prefix + name))
    return data ? data.value : null
  }

  remove (name) {
    localStorage.removeItem(this.prefix + name)
  }

  destroy() {
    this.ttl = null
    this.prefix = null
  }
}
