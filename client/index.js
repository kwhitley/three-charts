// import "babel-polyfill"
// console.log('fetch', window.fetch)
// console.log('Promise', window.Promise)
// window.polyfill = {
//   fetch,
//   Promise
// }

// core modules & classes
import { List, Map, fromJS } from 'immutable'
window.Map = Map // temporary for testing
window.List = List // temporary for testing
window.fromJS = fromJS

// styles
require('./styles/app.scss')

// react & redux
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { Provider } from 'react-redux'
import { loadState, saveState } from './lib/local-storage';
import API from './lib/api-store';

// reducers & actions
import reducers from './redux/reducers'
reducers.routing = routerReducer

// react router
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'


// child components
import { AppContainer } from './components/Layout/App'
import Pages from './components/Pages'

// setup initial state from localStorage
const localStorageKey = 'spa';
const persistedState = loadState(localStorageKey, Map());
API.setPortfolio(persistedState.getIn(['portfolio', 'selected']))

// create redux state store with default state of Map()
const appReducer = combineReducers(reducers)

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    state = undefined
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  persistedState,
  window.devToolsExtension ? window.devToolsExtension() : c => c
)

let state = store.getState().toJS()

fetch('/version').then(r => r.json()).then(data => {
  let { app } = state

  console.group(data.name, 'deployment')

  if (!app.version || app.version && app.version !== data.version) {
    app.version && console.warn('existing version', app.version, 'out of date... clearing session.')
    localStorage.clear()
    store.dispatch({ type: 'CLEAR_STATE' })
    store.dispatch({ type: 'SET_VERSION', version: data })
  }

  console.info('version', data.version)
  console.info('deployed on', new Date(data.deployed))

  console.groupEnd()
})

// on dispatch of events, stamp full state into localStorage
store.subscribe(() => {
  saveState(localStorageKey, store.getState());
});

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.get('routing')
})

let bootstrap = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={AppContainer}>
          <Route path="/help" component={Pages.Help} />
          <Route path="/logout" component={Pages.Logout} />
          <Route path="/login" component={Pages.Login} />
          <Route path="/reserves" component={Pages.Reserves} />
          <Route path="/summary" component={Pages.Summary} />
          <Route path="/operators" component={Pages.Operators} />
          <Route path="/typecurves" component={Pages.TypeCurves} />
          <Route path="/portfvsavg" component={Pages.PortfolioVsAverage} />
          <Route path="/topfields" component={Pages.TopFields} />
          <Route path="/history" component={Pages.History} />
          <Route path="/portfoliooverview" component={Pages.PortfolioOverview} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('app')
  )
}

if (state.user) {
  let later = new Date
  later.setTime(later.getTime() + 846000)

  API
    .auth(state.user)
    .then(user => {
      console.log(`user ${user.name} authenticated from previous session`)
      store.dispatch({ type: 'USER_LOGIN', user })
      store.dispatch({ type: 'USER_REFRESH', time: later })
      bootstrap()
    })
    .catch(err => {
      console.warn('AUTOLOGIN ERROR', err.message)
      store.dispatch({ type: 'USER_LOGOUT' })
      bootstrap()
    })
} else {
  console.log('no user found in state...')
  bootstrap()
}
