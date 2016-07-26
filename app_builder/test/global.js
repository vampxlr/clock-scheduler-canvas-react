import _$ from 'jquery';

import jsdom from 'jsdom';
import sinon_chrome from 'sinon-chrome'


global.jsdom =jsdom
global.location = {}
global.location.hostname = 'localhost'
global.document = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></body></html>');
global.window = global.document.defaultView;
global.chrome =sinon_chrome
global.$ = _$(window);
global.environment ='test'
global.navigator = window.navigator;


console.log("global loaded")