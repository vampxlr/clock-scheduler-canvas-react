import { applyMiddleware,compose,createStore} from 'redux'
import rootReducer from './reducers'
import logger from 'redux-logger'
import thunk from 'redux-thunk'


//with out logger
/**/

// with logger
let finalCreateStore;

if(global.environment!='test'){

     finalCreateStore = compose(
        applyMiddleware(thunk)
    )(createStore)

}else{

     finalCreateStore = compose(
        applyMiddleware(thunk,logger())
    )(createStore)

}


export default function configureStore( initialState={clockState:[],pieState:[],selectionState:[]} ){
    return finalCreateStore(rootReducer,initialState)
}