import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setBase } from '../redux/reducers/shop'

const Header = () => {
  const dispatch = useDispatch()
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div>
        {['USD', 'EUR', 'CAD'].map((el, index) => {
          return (
            <button
              key={index}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
              onClick={() => dispatch(setBase(el))}
            >
              {el}
            </button>
          )
        })}
      </div>
      <div className="text-white">
        <Link className="p-2 hover:text-blue-700" to="/">
          Main
        </Link>
        <Link className="p-2 hover:text-blue-700" to="/basket">
          Basket
        </Link>
        <Link className="p-2 hover:text-blue-700" to="/logs">
          Logs
        </Link>
      </div>
    </nav>
  )
}

export default Header
