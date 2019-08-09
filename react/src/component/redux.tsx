import * as React from "react"
import { createStore, combineReducers } from 'redux'

import { _NUMBER, _STRING, _ARRAY, _OBJECT } from '../redux/action'

// reducers拆分
import * as reducers from '../redux/reducers'
const store = createStore(combineReducers(reducers))

// import { test } from '../redux/reducers'
// const store = createStore(test)

store.subscribe(() => {
  let state = store.getState()
  console.log('监听调用', state)
})

export default class ReduxLearn extends React.Component<any, any> {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  change (e) {
    switch(e.target.id) {
      case 'num':
        store.dispatch(_NUMBER(Math.floor(Math.random() * 100)))
        break
      case 'str':
        let arr = new Array(Math.floor(Math.random() * 10))
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random()*(122-65+1)+65)
        store.dispatch(_STRING(arr.map(s => String.fromCharCode(s)).join('')))
        break
      case 'arr':
        let array = new Array(Math.floor(Math.random() * 10) || 10)
        for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 10)
        store.dispatch(_ARRAY(array))
        break
      case 'obj':
        let obj = {}
        for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
          let k = String.fromCharCode(Math.floor(Math.random()*(122-65+1)+65)) || 'test'
          obj[k] = k
        }
        store.dispatch(_OBJECT(obj))
        break
    }
    console.log('reducers', store.getState())
    this.setState(store.getState)
  }
  render () {
    return (
      <div>
        <div onClick={this.change.bind(this)}>
          <button id="num">数字</button>
          <button id="str">字符串</button>
          <button id="arr">数组</button>
          <button id="obj">对象</button>
        </div>
        <ul>
          <li>number: {this.state.test.number}</li>
          <li>string: {this.state.test.string}</li>
          <li>array: {this.state.test.array.join(',')}</li>
          <li>object: 
            <ul>
            {
              Object.entries(this.state.test.object).map(item => <li key={item[0]}>{item[0]} : {item[1]}</li>)
            }
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}
