import * as React from 'react'
import { createStore, combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'

import { _NUMBER } from '../redux/action'

import * as reducers from '../redux/reducers'
const store = createStore(combineReducers(reducers))

function mapDispatchToProps (dispatch) {
  return {
    change: () => dispatch(_NUMBER(Math.floor(Math.random() * 100)))
  }
}
// 将store中的state映射到组件的props中
function mapStateToProps (state) {
  console.log('--mapStateToProps--', state)
  return {
    number: state.test.number
  }
}

function ReactLearn (props) {
  const { number, change } = props
  return (
    <div>
      <ul>
        <li>number: {number}</li> <button onClick={change}>number</button>
      </ul>
    </div>
  )
}

const App = connect(mapStateToProps, mapDispatchToProps)(ReactLearn)

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
