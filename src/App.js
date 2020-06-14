import React from 'react';
import './App.css';
import AppNavBar from './components/layout/AppNavBar';
import Dashboard from './components/layout/Dashboard'
import AddClient from './components/clients/AddClient'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './helpers/auth'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import createReduxStore from './createrReduxStore'
import firebase from 'firebase'
import { createFirestoreInstance } from 'redux-firestore'
import ClientDetails from './components/clients/ClientDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Settings from './components/setting/Settings';
const rrfConfig = { userProfile: 'users' } // react-redux-firebase config

const store = createReduxStore()

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Router basename={process.env.PUBLIC_URL}>
          <div className="App">
            <AppNavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={UserIsAuthenticated(Dashboard)} />
                <Route exact path="/client/add/:id" component={UserIsAuthenticated(AddClient)} />
                <Route exact path="/client/:id" component={UserIsAuthenticated(ClientDetails)} />
                <Route exact path="/login" component={UserIsNotAuthenticated(Login)} />
                <Route exact path="/register" component={UserIsNotAuthenticated(Register)} />
                <Route exact path="/settings" component={UserIsAuthenticated(Settings)} />
              </Switch>
            </div>
          </div>
        </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
