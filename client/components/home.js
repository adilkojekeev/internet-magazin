import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router-dom'
import Header from './header'
import Catalog from './catalog'
import { getProducts, getRates } from '../redux/reducers/shop'
import Basket from './basket'
import Logs from './logs'

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProducts())
    dispatch(getRates())
  }, [])
  return (
    <div>
      <Header />
      <div className="container mx-auto py-12">
        <Route exact path="/" component={() => <Catalog />} />
        <Route exact path="/basket" component={() => <Basket />} />
        <Route exact path="/logs" component={() => <Logs />} />
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
