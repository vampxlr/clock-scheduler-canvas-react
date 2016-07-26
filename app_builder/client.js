import React , {Component} from 'react'
import { render } from 'react-dom'
import Root from './components/Root'

import configureStore from './redux/store'
import { Provider } from 'react-redux'




    let initialState = {
        pieState:[
            {
                id:0

            }
        ]

    }


    let store = configureStore()
    render(
        <Provider store={store}>
            <Root/>
        </Provider>,
        document.getElementById('app')
    );







