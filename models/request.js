class Request {
  constructor (clientId) {
    this.clientId = clientId
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    this.keyLength = 32
  }

  getKey() {
    let key = ''

    for (let i = 0; i < this.keyLength; ++i) {
      key += this.alphabet[parseInt(Math.random() * this.alphabet.length, 10)]
    }

    return key
  }

  async getHash (str, alg = 'SHA-256') {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest(alg, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async getSecureUrl (url) {
    const key = this.getKey()
    const time = parseInt(new Date().getTime() / 1000, 10)
    const hash = await this.getHash(this.clientId + time + key)
    const params = `key=${key}&time=${time}&hash=${hash}`
    return url + (url.indexOf('?') > -1 ? '&' : '?') + params
  }

  async get (url, isSecure = false) {
    const requestUrl = isSecure ? await this.getSecureUrl(url) : url
    return await (await fetch(requestUrl)).json()
  }
}
