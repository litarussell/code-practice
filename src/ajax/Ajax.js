~function (root) {
  function Ajax (options) {
    return new Ajax.prototype.init(options)
  }

  function init (options = {}) {
    let {
      url,
      methods,
      data = null,
      dataType = 'json',
      async = true,
      cache = true,
      success,
      error
    } = options
    ['url', 'method', 'data', 'dataType', 'async', 'cache', 'success', 'error'].forEach(item => this[item] = eval(item))
  }
  Ajax.prototype = {
    contractor: Ajax,
    init,
    sendAjax () {
      this.handleCache()
      this.handleData()
      let { method, url, async, error, success } = this
      let xhr = new XMLHttpRequest()
      xhr.open(method, url, async)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (!/^(2|3)\d{2}$/.test(xhr.status)) {
            error && error(chr.statusText, xhr)
          }
          let result = this.handleDataType(xhr)
          success && success(result, xhr)
        }
      }
      xhr.send()
    },
    handleDataType () {
      let dataType = this.dataType.toUpperCase()
      let result = xhr.responseText()
      switch (dataType) {
        case 'TEXT': break
        case 'JSON':
          result = JSON.parse(result)
          break
        case 'XML':
          result = xhr.responseXML
          break
      }
      return result
    },
    handleCache () {
      let { url, method, cache } = this
      if (/^GET$/i.test(method) && cache === false) {
        url += `${this.check()}=${+(new Date())}`
      }
    },
    handleData () {
      let { data, method } = this
      if (!data) return
      let str = ''
      if (typeof data === 'object') {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            str += `${key}=${data[key]}`
          }
        }
        data = str.substring(0, str.length)
      }
      if (/^(GET|DELETE|HEAD|TRACE|OPTIONS)$/i.test(method)) {
        this.url += `${this.check()}${data}`
        this.data = null
        return
      }
      this.data = data
    },
    check () {
      return this.url.indexOf('?') > -1 ? '&' : '?'
    }
  }
  init.prototype = Ajax.prototype

  root.ajax = Ajax
}(window)