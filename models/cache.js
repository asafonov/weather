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
