/**
 * flux模式用以保持数据的单向流动
 */

/**
 * 派发器
 * 利用发布订阅模式 桥接 action和store
 * 主要的通用方法
 */ 
class Dispatcher {
  constructor () {
    this._callbacks = {}
    this._lastID = 1

    this._isDispatching = false
    this._isHandled = {}
    this._isPending = {}
  }
  // 注册维护store数据的回调
  register (callback) {
    let id = this._lastID++
    this._callbacks[id] = callback
    return id
  }
  // 调用
  dispatch (payload) {
    this._startDispatching(payload)
    try {
      for (let id in this._callbacks) {
        if (this._isPending[id]) continue
        this._invokeCallback(id)
      }
    } finally {
      this._stopDispatching()
    }
  }
  // 移除回调
  unregister (id) {
    delete this._callbacks[id]
  }
  // 
  waitFor (ids) {
    for (let ii = 0; ii < ids.length; ii++) {
      let id = ids[ii]
      if (this._isPending[id]) continue
      this._invokeCallback(id)
    }
  }
  // 是否正在分发
  isDispatching () {
    return this._isDispatching
  }

  _invokeCallback (id) {
    this._isPending[id] = true
    this._callbacks[id](this._pendingPayload)
    this._isHandled[id] = true
  }
  _startDispatching (payload) {
    for (let id in this._callbacks) {
      this._isPending[id] = false
      this._isHandled[id] = false
    }
    this._pendingPayload = payload
    this._isDispatching = true
  }
  _stopDispatching () {
    delete this._pendingPayload
    this._isDispatching = false
  }
}

/**
 * 数据维护
 * 通过继承这个类, 完成自定义store
 */
class Store {
  constructor (dispatcher) {
    this.__changed = false
    this.__changeEvent = 'change'
    this.__dispatcher = dispatcher
    this.__emitter = new EventEmitter()
    this._dispatchToken = dispatcher.register(payload => {
      this.__invokeOnDispatch(payload)
    })
    /* ---------------------------------------------------- */
    this._state = this.getInitialState()
  }
 
  getState () {
    return this._state
  }
  getInitialState () {}
  reduce () {}
  areEqual (one, two) {
    return one === two
  }
  __invokeOnDispatch(action) {
    this.__changed = false
    const startingState = this._state
    const endingState = this.reduce(startingState, action)

    if (!this.areEqual(startingState, endingState)) {
      this._state = endingState
      this.__emitChange()
    }

    if (this.__changed) {
      this.__emitter.emit(this.__changeEvent)
    }
  }

  /* ------------------------------------------------------------ */
  // addListener (callback) {
  //   return this.__emitter.addListener(this.__changeEvent, callback)
  // }
  // getDispatcher () {
  //   return this.__dispatcher
  // }
  // getDispatchToken () {
  //   return this.__dispatchToken
  // } 
  // hasChanged () {
  //   return this.__changed
  // }
  // __emitChange () {
  //   this.__changed = true
  // }
  // __invokeOnDispatch (payload) {
  //   this.__changed = false
  //   this.__onDispatch(payload)
  //   if (this.__changed) this.__emitter.emit(this.__changeEvent)
  // }
}

const dispatcher = new Dispatcher()




// 自定义store
class AppStore extends Store {
  constructor () {
    super(dispatcher)
  }
  // 初始化状态
  getInitialState () {
    return {
      num: 0
    }
  }
  reduce (state, action) {
    switch (action.type) {
      case 'test':
        return 'test'
      default:
        return state
    }
  }
}

// 和业务相关的操作
const Action = function (dispatch) {
  return {
    test: data => dispatch({ type: 'test', action: data })
  }
}


const app = new Action(dispatcher)
