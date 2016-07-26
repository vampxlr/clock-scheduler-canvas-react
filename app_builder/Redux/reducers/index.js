import {combineReducers} from 'redux'

import clockReducer from './clockReducer'
import pieReducer from './pieReducer'
import selectionReducer from './selectionReducer'

const rootReducer = combineReducers({

    clockState:clockReducer,
    pieState:pieReducer,
    selectionState:selectionReducer
})

export default rootReducer