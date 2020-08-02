import axios from 'axios'

const GET_PRODUCTS = '@@GET_PRODUCTS'
const SET_RATES = '@@SET_RATES'

const initialState = {
  products: [],
  selected: {},
  currency: {},
  base: 'EUR'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: action.products }
    case 'ADD_SELECTION':
      return {
        ...state,
        selected: { ...state.selected, [action.id]: (state.selected[action.id] || 0) + 1 }
      }
    case 'REMOVE_SELECTION': {
      const updateSelected = {
        ...state.selected,
        [action.id]: (state.selected[action.id] || 0) - 1
      }
      if (updateSelected[action.id] < 1) {
        delete updateSelected[action.id]
      }
      return { ...state, selected: updateSelected }
    }
    case SET_RATES:
      return { ...state, currency: action.rates }
    case 'SET_BASE':
      return { ...state, base: action.base }
    case 'SORT_CATALOG':
      return { ...state, products: action.products }
    default:
      return state
  }
}

export function getProducts() {
  return (dispatch) => {
    axios('/api/v1/products').then(({ data }) =>
      dispatch({ type: GET_PRODUCTS, products: data.products })
    )
  }
}

export function addToSelection(id) {
  return { type: 'ADD_SELECTION', id }
}

export function removeFromSelection(id) {
  return { type: 'REMOVE_SELECTION', id }
}

export function getRates() {
  return (dispatch) => {
    axios('/api/v1/currency').then(({ data: { rates } }) => dispatch({ type: SET_RATES, rates }))
  }
}

export function setBase(base) {
  return { type: 'SET_BASE', base }
}

export function sortCatalog(catalog, sortType) {
  const products = [...catalog]
  if (sortType === 'highest') {
    products.sort((a, b) => a.price - b.price)
  }
  if (sortType === 'lowest') {
    products.sort((a, b) => b.price - a.price)
  }
  return { type: 'SORT_CATALOG', products }
}
