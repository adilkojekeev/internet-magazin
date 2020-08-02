import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToSelection, removeFromSelection, sortCatalog } from '../redux/reducers/shop'

const Catalog = () => {
  const products = useSelector((store) => store.shop.products)
  const selected = useSelector((store) => store.shop.selected)
  const currency = useSelector((store) => store.shop.currency)
  const base = useSelector((store) => store.shop.base)
  const dispatch = useDispatch()
  const ratesSumbols = {
    USD: '$',
    EUR: '€',
    CAD: 'C$'
  }
  return (
    <div>
      <select
        className="form-input p-2 rounded mb-2"
        onChange={(e) => dispatch(sortCatalog(products, e.target.value))}
      >
        <option value="">Select</option>
        <option value="highest">Lowest to highest</option>
        <option value="lowest">Lowest to lowest</option>
      </select>
      <div className="flex flex-wrap -mx-10">
        {products.map((el) => (
          <div key={el.id} className="w-1/4 px-2">
            <div className=" border-2 border-gray-400  rounded p-6 mb-3 text-center">
              <img src={el.image} alt="" className="h-56 w-full object-contain" />
              <h4>{el.title}</h4>
              <p>
                {(el.price * (currency[base] || 1)).toFixed(2)} {ratesSumbols[base]}
              </p>
              <div className="quantity flex justify-center mt-2">
                <button
                  type="button"
                  className="border-2 border-blue-gray-200 px-3 rounded hover:border-gray-700"
                  onClick={() => dispatch(removeFromSelection(el.id))}
                >
                  -
                </button>
                <span className="inline-block px-3">{selected[el.id] || 0}</span>
                <button
                  type="button"
                  className="border-2 border-gray-200 px-3 rounded hover:border-gray-700"
                  onClick={() => dispatch(addToSelection(el.id))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Catalog
