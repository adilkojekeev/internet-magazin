import axios from 'axios'

const initialState = {
  logs: []
}
export default (state = initialState, action) => {
  if (!action.type.includes('@@')) {
    axios({
      method: 'POST',
      url: 'api/v1/logs',
      data: action
    })
  }
  switch (action.type) {
    case '@@SET_LOGS':
      return { ...state, logs: action.logs }
    default:
      return state
  }
}

export function setLogs() {
  return (dispatch) => {
    axios('/api/v1/logs').then(({ data }) => dispatch({ type: '@@SET_LOGS', logs: data }))
  }
}
