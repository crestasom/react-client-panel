import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import thunk from "redux-thunk"
import firebase from 'firebase'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import notifyReducer from './reducers/notifyReducer'
import settingReducer from './reducers/settingReducer'


//check for settings in local storage
if (localStorage.getItem('settings') === null) {
    //default settings
    const defaultSettings = {
        disableBalanceOnAdd: true,
        disableBalanceOnEdit: false,
        allowRegistration: false,
    }
    localStorage.setItem('settings', JSON.stringify(defaultSettings))
}
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) }
const middleware = [thunk]
// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore
    notify: notifyReducer,
    settings: settingReducer
})
export default () => {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
        // applyMiddleware(...middleware) // to add other middleware
    )
}

const firebaseConfig = {
    apiKey: "AIzaSyD-xUO71bIG9SyNYUIw-HciYodc139gU5k",
    authDomain: "react-contactmgr.firebaseapp.com",
    databaseURL: "https://react-contactmgr.firebaseio.com",
    projectId: "react-contactmgr",
    storageBucket: "react-contactmgr.appspot.com",
    messagingSenderId: "787690586782",
    appId: "1:787690586782:web:0e0d75dfc3baf8581a318f",
    measurementId: "G-4WR98KR1S6"
}
// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const settings = {
    //timestampsInSnapshots: true
}
firestore.settings(settings)