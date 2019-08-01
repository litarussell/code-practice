~function (root) {
  let _default = {
    method: 'GET',
    url: '',
    baseURL: '',
    headers: {},
    dataType: 'JSON',
    data: null, // POST
    params: null, // GET
    cache: true
  }
  let ajaxPromise = function axios (options) {
    let {
      url,
      baseURL,
      data,
      dataType,
      headers,
      cache,
      params
    } = options
    if(/^(GET|DELETE|HEAD|OPTIONS)$/.test(method)){
      // GET参数
      if (params) url += `${ajaxPromise.check(url)}${ajaxPromise.formatData(params)}`
      if (cache === false) url += `${ajaxPromise.check(url)}_=${+(new Date())}`
      data = null; // GET系列请求主体为空
    } else {
      // POST数据
      if(data) data = ajaxPromise.formatData(data)
    }
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open(method, `${baseURL}${url}`)
      if (headers != null && typeof headers === 'object') {
        for (let attr in headers) {
          if (headers.hasOwnProperty(attr)) {
            let val = headers[attr]
            if (/[\u4e00-\u9fa5]/.test(val)) val = encodeURIComponent(val)
            xhr.setRequestHeader(attr, headers[attr])
          }
        }
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4){
          if(/^(2|3)\d{2}$/.test(xhr.status)){
            let result = xhr.responseText
            dataType = dataType.toUpperCase()
            dataType === 'JSON' ? result = JSON.parse(result) : (dataType === 'XML' ? result = xhr.responseXML : null)
            resolve(result, xhr)
            return
          }
          reject(xhr.statusText, xhr)
        }
      }
      xhr.send(data)
    })
  }

  ajaxPromise.defaults = _default

  ajaxPromise.formatData = function () {
    let str = ''
    for (let attr in obj) {
      if(obj.hasOwnProperty(attr)) {
        str += `${attr}=${obj[attr]}&`
      }
      return str.substring(0, str.length-1)
    }
  }

  ajaxPromise.check = function check (url) {
    return url.indexOf('?') >- 1 ? '&' : '?'
  }

  ['get', 'delete', 'head', 'options'].forEach(item => {
    ajaxPromise[item] = (url, options = {}) => {
      options = {
        ..._default,
        ...options, 
        url, 
        method: item.toUpperCase()
      };
      return ajaxPromise(options)
    }
  })

  ['post', 'put', 'patch'].forEach(item => {
    ajaxPromise[item] = (url, data = {}, options = {}) => {
      options = {
        ..._default,
        ...options, 
        url, 
        method: item.toUpperCase(),
        data
      }
      return ajaxPromise(options)
    }
  })

  window.ajaxPromise = ajaxPromise
}(window)