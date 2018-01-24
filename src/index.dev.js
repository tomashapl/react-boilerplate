import React from "react"
import ReactDOM from "react-dom"

import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import reducers from "./reducers/index"

import App from "./App"

const configureStore = () => {

  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  const middleware = [thunk, logger]

  const store = createStore(reducers, applyMiddleware(...middleware))

  if (module.hot) {
    module.hot.accept('./reducers/index', () => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store
}
const store = configureStore()

const render = (Component) => {
  return (
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <Component />
        </Provider>
      </AppContainer>
    , document.getElementById('react'))
  )
}

render(App)

if (module.hot) {
  require("./App.styl")
  module.hot.accept('./App', () => {
    var NextApp = require('./App').default;
    render(NextApp)
  });
}

window.reduxStore = store
