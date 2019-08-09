import {
  NUM_STATE, STRING_STATE, ARRAY_STATE, OBJECT_STATE
} from '../actionTypes'

const initState = {
  string: 'test',
  number: 1,
  array: ['test'],
  object: {test: 'test'}
}

export default function (state = initState, action) {
  switch (action.type) {
    case NUM_STATE:
      console.log(NUM_STATE, state, action)
      return Object.assign({}, state, { number: action.data })
    case STRING_STATE:
      console.log(STRING_STATE, state, action)
      return Object.assign({}, state, { string: action.data })
    case ARRAY_STATE:
      console.log(ARRAY_STATE, state, action)
      return Object.assign({}, state, { array: action.data })
    case OBJECT_STATE:
      console.log(OBJECT_STATE, state, action)
      return Object.assign({}, state, { object: action.data })
    default:
      console.log('default', state, action)
      return state
  }
}