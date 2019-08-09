import {
  NUM_STATE, STRING_STATE, ARRAY_STATE, OBJECT_STATE
} from '../actionTypes'

export function _NUMBER (data) {
  return {
    type: NUM_STATE,
    data
  }
}
export function _STRING (data) {
  return {
    type: STRING_STATE,
    data
  }
}
export function _ARRAY (data) {
  return {
    type: ARRAY_STATE,
    data
  }
}
export function _OBJECT (data) {
  return {
    type: OBJECT_STATE,
    data
  }
}
