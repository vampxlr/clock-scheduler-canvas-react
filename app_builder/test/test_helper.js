import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from '../redux/store'


chaiJquery(chai, chai.util, $);
function renderComponent(ComponentClass, props = {}, state = {}) {
    let initialState

    if($.isEmptyObject(state)){
        initialState = {}
    }else{
        initialState = state
    }
    let store = configureStore(initialState)

    const componentInstance =  TestUtils.renderIntoDocument(
        <Provider store={store}>
            <ComponentClass {...props} />
        </Provider>
    );
    return $(ReactDOM.findDOMNode(componentInstance));
}

$.fn.simulate = function(eventName, value,ExtraParameter) {
    if (value) {
        this.val(value);
    }

    TestUtils.Simulate[eventName](this[0],ExtraParameter);
};

export {renderComponent, expect};
